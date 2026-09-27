import { PERFUMES, type Perfume } from "./coupons";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SAMPLE PRICING — NOT PUBLISHED AS FACT
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Every number in this file is illustrative. None of it came from a retailer
 * feed, a price-history service or a manual check, so none of it may be shown
 * to a visitor as a real price. The UI reads `PRICING_IS_SAMPLE` and labels
 * these rows accordingly — the label is not decoration, it is the only thing
 * standing between a placeholder and a false price claim.
 *
 * This file is the single seam where real data enters. When a retailer feed or
 * a price-checked `retailer_offers` read replaces these literals:
 *
 *   1. flip `PRICING_IS_SAMPLE` to false — every "example pricing" label in
 *      the UI disappears on its own, and
 *   2. delete `DEMAND_NOTE` plus the `demand` field, which is the same kind of
 *      unverified figure and carries the same obligation.
 *
 * The `slug` on each deal is the join key back into the catalog, so nothing
 * here can drift away from the product pages it links to.
 *
 * Money is in minor units, matching `retailer_offers.price_cents`: a price
 * that round-trips through a float is a price that eventually reads $45.98.
 */

export const PRICING_IS_SAMPLE = true;

/**
 * Stands in for the search-volume figures used to rank these products. It is
 * shown to visitors as a demand signal, so it is held to the same standard as
 * the prices: unsourced, therefore labelled.
 */
export const DEMAND_NOTE =
  "Demand figures are illustrative placeholders, not measured search volume.";

export type DealOffer = {
  retailer: string;
  /** Minor units. `null` means "we have no checked price", not "free". */
  priceCents: number | null;
  referencePriceCents: number | null;
  discountLabel: string | null;
  url: string;
  /** ISO date of the last real check, or `null` when never checked. */
  checkedAt: string | null;
};

export type Deal = {
  /** Join key into `PERFUMES`. A deal with no matching catalog entry is a bug. */
  slug: string;
  /** Relative demand band, e.g. "High volume". Illustrative. */
  demand: string;
  offers: DealOffer[];
};

/** One row in the cross-store comparison table. */
export type ComparisonRow = {
  slug: string;
  /** Store column keys, in display order. */
  stores: Record<string, number | null>;
};

export const COMPARE_STORES = ["FragranceNet", "Amazon"] as const;

function catalogEntry(slug: string) {
  const found = PERFUMES.find((p) => p.slug === slug);
  if (!found) {
    // A deal pointing at a slug the catalog does not have would render a card
    // whose every link 404s. Fail loudly at module load instead.
    throw new Error(`deals.ts references unknown catalog slug: "${slug}"`);
  }
  return found;
}

/* ── Featured deals ─────────────────────────────────────────────────────────
   Aventus, Sauvage Parfum and Bleu de Chanel are the three highest-intent
   entries in the catalog. They are here — not Cool Water or Light Blue —
   because those two have no catalog entry at all: no product page, no packshot,
   and no researched notes. Featuring them would mean inventing all three, and
   an invented price card is the exact failure this project is built to avoid. */

const AVENTUS = catalogEntry("creed-aventus");
const SAUVAGE = catalogEntry("dior-sauvage");
const BLEU = catalogEntry("bleu-de-chanel");

export const FEATURED_DEALS: Deal[] = [
  {
    slug: AVENTUS.slug,
    demand: "Premium · high intent",
    offers: [
      {
        retailer: "FragranceNet",
        priceCents: 37100,
        referencePriceCents: 49500,
        discountLabel: "25% OFF",
        url: AVENTUS.affiliateUrl,
        checkedAt: null,
      },
      {
        retailer: "Amazon",
        priceCents: 42500,
        referencePriceCents: null,
        discountLabel: null,
        url: "https://www.amazon.com/s?k=creed+aventus+100ml",
        checkedAt: null,
      },
    ],
  },
  {
    slug: SAUVAGE.slug,
    demand: "High volume",
    offers: [
      {
        retailer: "FragranceNet",
        priceCents: 14800,
        referencePriceCents: 18500,
        discountLabel: "20% OFF",
        url: SAUVAGE.affiliateUrl,
        checkedAt: null,
      },
      {
        retailer: "Amazon",
        priceCents: null,
        referencePriceCents: null,
        discountLabel: null,
        url: "https://www.amazon.com/s?k=dior+sauvage+parfum+100ml",
        checkedAt: null,
      },
    ],
  },
  {
    slug: BLEU.slug,
    demand: "High volume",
    offers: [
      {
        retailer: "FragranceNet",
        priceCents: 13200,
        referencePriceCents: 16500,
        discountLabel: "20% OFF",
        url: BLEU.affiliateUrl,
        checkedAt: null,
      },
      {
        retailer: "Amazon",
        priceCents: null,
        referencePriceCents: null,
        discountLabel: null,
        url: "https://www.amazon.com/s?k=chanel+bleu+de+chanel+edp",
        checkedAt: null,
      },
    ],
  },
];

/** The cross-store table. Sourced from the same deals, never a second copy. */
export const COMPARISON_ROWS: ComparisonRow[] = FEATURED_DEALS.map((deal) => {
  const stores: Record<string, number | null> = {};
  for (const store of COMPARE_STORES) {
    const offer = deal.offers.find((o) => o.retailer === store);
    stores[store] = offer?.priceCents ?? null;
  }
  return { slug: deal.slug, stores };
});

export function dealForSlug(slug: string): Deal | undefined {
  return FEATURED_DEALS.find((d) => d.slug === slug);
}

/**
 * Where a card for this fragrance should go.
 *
 * A fragrance with listed offers belongs on the comparison page — that is the
 * page that answers "where do I buy this", which is the question a card click
 * implies. One with no offers has nothing to compare, so it goes to the review
 * instead, where there is actual content. Sending everything to one of the two
 * would mean either dead-ending shoppers on a page with no prices or burying
 * the review behind an extra step.
 */
export function pathForSlug(slug: string): string {
  return dealForSlug(slug) ? `/compare/${slug}` : `/perfumes/${slug}`;
}

/**
 * Fragrances most worth looking at next to this one.
 *
 * Scored on two things we actually have: shared words in the scent family, and
 * shared notes across the pyramid. That is a real signal — a reader who likes
 * the vetiver and sandalwood in Oud Wood genuinely does want to see Sauvage
 * Parfum next to it.
 *
 * The prompt this replaces asked for a query on a `tags` array. No such array
 * exists, and inventing one to match it would mean shipping a field nobody
 * derived from anything. Family and notes are the fields that carry the meaning.
 */
export function similarTo(slug: string, limit = 4): Perfume[] {
  const source = PERFUMES.find((p) => p.slug === slug);
  if (!source) return [];

  const familyWords = (s: string) => new Set(s.toLowerCase().split(/\s+/).filter(Boolean));
  const sourceFamily = familyWords(source.family);
  const sourceNotes = new Set(
    [...source.topNotes, ...source.heartNotes, ...source.baseNotes].map((n) => n.toLowerCase()),
  );

  return PERFUMES.filter((p) => p.slug !== slug)
    .map((p) => {
      const pFamily = familyWords(p.family);
      let familyOverlap = 0;
      for (const word of pFamily) if (sourceFamily.has(word)) familyOverlap += 1;

      const pNotes = [...p.topNotes, ...p.heartNotes, ...p.baseNotes].map((n) => n.toLowerCase());
      const noteOverlap = pNotes.filter((n) => sourceNotes.has(n)).length;

      return { perfume: p, score: familyOverlap * 2 + noteOverlap };
    })
    /* A score of zero means nothing in common — better to show nothing than to
       pad the row with an arbitrary fragrance that shares no notes at all. */
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.perfume.name.localeCompare(b.perfume.name))
    .slice(0, limit)
    .map((entry) => entry.perfume);
}

/**
 * The lowest checked price and how much it beats the highest by, in percent.
 * Returns `null` unless at least two stores have a real number — a "save 0%"
 * or a "save 100%" built from one or zero data points is noise, not a saving.
 */
export function savingFor(row: ComparisonRow): { lowestCents: number; percent: number } | null {
  const prices = COMPARE_STORES.map((s) => row.stores[s]).filter(
    (value): value is number => typeof value === "number",
  );
  if (prices.length < 2) return null;

  const lowestCents = Math.min(...prices);
  const highestCents = Math.max(...prices);
  if (highestCents <= 0 || lowestCents >= highestCents) return null;

  return {
    lowestCents,
    percent: Math.round(((highestCents - lowestCents) / highestCents) * 100),
  };
}

export function formatMoney(cents: number | null): string {
  if (cents === null) return "Not listed";
  return `$${(cents / 100).toFixed(2)}`;
}

/* ── How it works ──────────────────────────────────────────────────────────
   Three steps, because three is what the path actually has. Each one names the
   action the reader takes, not a feature of ours. */

export const DEAL_STEPS = [
  {
    title: "Search or browse",
    body: "Look up a fragrance by name or house, or browse the collection by scent family.",
  },
  {
    title: "Compare the offers",
    body: "See every retailer we list for that fragrance side by side, with the price we last recorded.",
  },
  {
    title: "Choose where to buy",
    body: "Follow the link to the retailer. You pay their price, not ours — we never sell a bottle.",
  },
] as const;

/* ── FAQ ───────────────────────────────────────────────────────────────────
   Every answer here is one we can actually stand behind.

   There is no "Is <retailer> legit?" question. We do not vet retailers, we
   link to them, and answering as though we had would be a claim we cannot
   support. There is also no "how do <retailer> coupons work?" question, because
   this site does not issue coupon codes. */

export const DEAL_FAQS = [
  {
    question: "Are the prices on this page live?",
    answer:
      "No — and the page says so wherever a price appears. Right now the figures are placeholders, so treat them as an illustration of the format rather than a shopping list. They are replaced automatically once a checked retailer feed is connected.",
  },
  {
    question: "How does PhiloFragrancy make money?",
    answer:
      "Through affiliate links. If you buy something after following one of our retailer links we may earn a commission. It costs you nothing extra and it does not change the price you pay. That relationship is the reason we can keep the editorial side free.",
  },
  {
    question: "Do you sell fragrances?",
    answer:
      "No. We never hold stock and we never take an order. Every buy button leaves our site and lands on the retailer's own checkout, where their pricing, shipping and returns policy apply.",
  },
  {
    question: "What is the difference between EDT, EDP and Parfum?",
    answer:
      "It is the concentration of aromatic oils in the liquid. By long-standing convention an Eau de Toilette sits around 5–15%, an Eau de Parfum around 15–20%, and a Parfum or Extrait higher still. Higher concentration generally means it lasts longer and sits closer to the skin, and it usually costs more. These are conventions rather than a regulated standard, so two houses can label the same strength differently.",
  },
  {
    question: "How do I choose between two fragrances I have never smelled?",
    answer:
      "Start from the notes pyramid, not the bottle. Citrus and marine openings fade first, so they suit daytime and heat. Woods, resins and vanilla sit closer to the skin and last longer, so they carry into evening. Read the review on the product page before you commit — it covers the drydown, which is what you will actually be wearing for most of the day.",
  },
] as const;
