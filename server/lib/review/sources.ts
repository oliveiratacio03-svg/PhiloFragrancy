/**
 * Research adapters — FACTS ONLY.
 *
 * The rule this module enforces: an adapter may lift structured facts (notes,
 * year, perfumer, concentration, community consensus) out of a source. It may
 * never lift prose. There is deliberately no field here for "review text" or
 * "description" from a third party, because that is the field that would turn
 * synthesis into paraphrase. Facts are not copyrightable in the way review
 * prose is, and keeping the boundary in the type system is the cheapest way to
 * guarantee the generated review is original by construction.
 *
 * Community databases (Fragrantica, Parfumo, Basenotes) ship no public API and
 * their terms restrict automated retrieval. Those adapters are therefore
 * registered DISABLED: the pipeline refuses to touch them until an editor
 * confirms clearance and flips them on. The official house site is enabled,
 * because it is the authoritative publisher of its own note pyramid and is
 * meant to be read by machines.
 */

export type SourceKind = "official" | "database" | "community" | "publication";

/** Consensus signals, never measurements. */
export type PerformanceConsensus = {
  longevity: "low" | "moderate" | "strong" | "very_strong" | "unknown";
  projection: "low" | "moderate" | "strong" | "very_strong" | "unknown";
  sillage: "low" | "moderate" | "strong" | "very_strong" | "unknown";
  /** How many independent sources agreed, and any that disagreed. */
  agreement: string;
  disagreement?: string;
};

export type FragranceFacts = {
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  releaseYear?: number;
  perfumer?: string;
  concentration?: string;
  family?: string;
  performance?: PerformanceConsensus;
  /** Recurring observations, as short factual tags — not sentences. */
  observations?: string[];
};

export type SourceResult = {
  facts: FragranceFacts;
  /** Fields where this source contradicted another. Never silently resolved. */
  conflicts?: string[];
  httpStatus?: number;
};

export type PerfumeRef = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  concentration: string;
  family: string;
  houseUrl?: string | null;
  releaseYear?: number | null;
  perfumer?: string | null;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
};

export type SourceAdapter = {
  id: string;
  name: string;
  kind: SourceKind;
  /** Off until an editor clears the terms. */
  enabled: boolean;
  /** Why it is off, surfaced in the run record so the gap is never invisible. */
  disabledReason?: string;
  urlFor: (perfume: PerfumeRef) => string | null;
  fetchFacts: (perfume: PerfumeRef) => Promise<SourceResult>;
};

const USER_AGENT = "PhiloFragranceBot/1.0 (+editorial research; contact via site)";

/* ── Official house site ────────────────────────────────────────────────────
   Enabled. Parses JSON-LD Product blocks and a small set of note headings.
   Anything it cannot find is simply absent — we never guess a note. */

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function collectJsonLd(html: string): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(re)) {
    try {
      const parsed = JSON.parse(decodeEntities(match[1].trim()));
      if (Array.isArray(parsed)) out.push(...(parsed as Record<string, unknown>[]));
      else if (parsed && typeof parsed === "object") {
        const graph = (parsed as Record<string, unknown>)["@graph"];
        if (Array.isArray(graph)) out.push(...(graph as Record<string, unknown>[]));
        else out.push(parsed as Record<string, unknown>);
      }
    } catch {
      /* malformed JSON-LD is common; ignore it rather than fail the run */
    }
  }
  return out;
}

function readNotesFromHtml(html: string): { top?: string[]; heart?: string[]; base?: string[] } {
  const text = decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
  const grab = (label: string): string[] | undefined => {
    const re = new RegExp(`${label}\\s*(?:notes)?\\s*[:\\-–]\\s*([^.;]{2,160})`, "i");
    const m = text.match(re);
    if (!m) return undefined;
    const items = m[1]
      .split(/,|;|\band\b|&/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1 && s.length < 40);
    return items.length ? Array.from(new Set(items)) : undefined;
  };
  return { top: grab("top notes"), heart: grab("heart notes"), base: grab("base notes") };
}

const officialHouse: SourceAdapter = {
  id: "official-house",
  name: "Official house website",
  kind: "official",
  enabled: true,
  urlFor: (perfume) => perfume.houseUrl ?? null,
  fetchFacts: async (perfume) => {
    const url = perfume.houseUrl;
    if (!url) return { facts: {}, conflicts: ["no house url recorded for this perfume"] };

    const res = await fetch(url, { headers: { "user-agent": USER_AGENT, accept: "text/html" } });
    if (!res.ok) {
      return { facts: {}, httpStatus: res.status, conflicts: [`house site returned ${res.status}`] };
    }
    const html = await res.text();

    const facts: FragranceFacts = {};
    const conflicts: string[] = [];
    const notes = readNotesFromHtml(html);
    if (notes.top) facts.topNotes = notes.top;
    if (notes.heart) facts.heartNotes = notes.heart;
    if (notes.base) facts.baseNotes = notes.base;

    for (const block of collectJsonLd(html)) {
      const name = typeof block.name === "string" ? block.name : "";
      if (/note|olfact|pyramid/i.test(name) && Array.isArray(block.itemListElement)) {
        conflicts.push(`house site exposes a note list we do not parse yet: "${name}"`);
      }
    }
    return { facts, conflicts, httpStatus: res.status };
  },
};

/* ── Community databases ────────────────────────────────────────────────────
   Registered but disabled. See the module comment: no public API, restricted
   terms. When an editor supplies clearance, implement fetchFacts to read the
   site's structured fields and set enabled: true. */

function disabledCommunity(id: string, name: string, host: string): SourceAdapter {
  return {
    id,
    name,
    kind: "community",
    enabled: false,
    disabledReason:
      `No public API and automated retrieval is restricted by ${host}'s terms. ` +
      "Enable only after an editor confirms clearance.",
    urlFor: (perfume) => `https://${host}/search?q=${encodeURIComponent(`${perfume.brand} ${perfume.name}`)}`,
    fetchFacts: async () => ({ facts: {} }),
  };
}

const ADAPTERS: SourceAdapter[] = [
  officialHouse,
  disabledCommunity("fragrantica", "Fragrantica", "fragrantica.com"),
  disabledCommunity("parfumo", "Parfumo", "parfumo.com"),
  disabledCommunity("basenotes", "Basenotes", "basenotes.com"),
];

export function listAdapters(): SourceAdapter[] {
  return ADAPTERS;
}

/**
 * Collect facts from every enabled adapter. Disabled adapters are reported so
 * the run record shows exactly how much of the research base was actually
 * reachable — a run with one source is not the same as a run with four.
 */
export async function collectFacts(perfume: PerfumeRef): Promise<{
  facts: FragranceFacts;
  used: { id: string; name: string; kind: SourceKind; url: string | null; conflicts: string[] }[];
  skipped: { id: string; name: string; reason: string }[];
  conflicts: string[];
}> {
  const facts: FragranceFacts = {};
  const used: Awaited<ReturnType<typeof collectFacts>>["used"] = [];
  const skipped: Awaited<ReturnType<typeof collectFacts>>["skipped"] = [];
  const conflicts: string[] = [];

  for (const adapter of ADAPTERS) {
    if (!adapter.enabled) {
      skipped.push({ id: adapter.id, name: adapter.name, reason: adapter.disabledReason ?? "disabled" });
      continue;
    }
    const url = adapter.urlFor(perfume);
    if (!url) {
      skipped.push({ id: adapter.id, name: adapter.name, reason: "no url resolvable for this perfume" });
      continue;
    }
    try {
      const result = await adapter.fetchFacts(perfume);
      Object.assign(facts, { ...facts, ...result.facts });
      conflicts.push(...(result.conflicts ?? []).map((c) => `${adapter.name}: ${c}`));
      used.push({ id: adapter.id, name: adapter.name, kind: adapter.kind, url, conflicts: result.conflicts ?? [] });
    } catch (error) {
      skipped.push({
        id: adapter.id,
        name: adapter.name,
        reason: `fetch failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  return { facts, used, skipped, conflicts };
}
