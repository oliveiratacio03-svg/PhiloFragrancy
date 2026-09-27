import { defineAction } from "@agent-native/core/action";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";
import { collectFacts, listAdapters, type PerfumeRef } from "../server/lib/review/sources.js";
import { buildReviewPrompt, PROMPT_VERSION, type ReviewSections } from "../server/lib/review/prompt.js";
import { generateReview, generationStatus, ReviewGenerationNotConfiguredError } from "../server/lib/review/generate.js";
import { hasBlocking, runQc } from "../server/lib/review/qc.js";

function parseNotes(raw: string): string[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((n): n is string => typeof n === "string") : [];
  } catch {
    return [];
  }
}

function rowToRef(row: typeof schema.perfumes.$inferSelect): PerfumeRef {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    concentration: row.concentration,
    family: row.family,
    houseUrl: row.houseUrl,
    releaseYear: row.releaseYear,
    perfumer: row.perfumer,
    topNotes: parseNotes(row.topNotes),
    heartNotes: parseNotes(row.heartNotes),
    baseNotes: parseNotes(row.baseNotes),
  };
}

/**
 * The review pipeline: research → prompt → generate → quality control → draft.
 *
 * It writes a DRAFT and nothing else. There is no code path here that sets
 * status to "published": an unreviewed machine draft must never reach a public
 * product page. Promotion is a separate, human decision.
 */
export default defineAction({
  description:
    "Research a fragrance's facts, draft an original PhiloFragrance review, run the editorial quality-control checklist, and store it as a DRAFT. Never publishes. Requires a configured review model.",
  schema: z.object({
    slug: z.string().min(1).describe("Slug of the perfume to draft a review for"),
  }),
  run: async ({ slug }, ctx) => {
    const db = getDb();
    const now = new Date().toISOString();

    // Credentials are scoped to the caller. Without a caller there is no scope
    // to read a secret from, so the run stops here rather than guessing one.
    if (!ctx?.userEmail) {
      throw new Error(
        "This action must run as a signed-in user: the review model's API key is read from that account's secret store.",
      );
    }
    const credentialCtx = { userEmail: ctx.userEmail, orgId: ctx.orgId };

    const rows = await db.select().from(schema.perfumes).where(eq(schema.perfumes.slug, slug)).limit(1);
    const perfumeRow = rows[0];
    if (!perfumeRow) {
      throw new Error(`No perfume with slug "${slug}". Run seed-catalog first.`);
    }
    const perfume = rowToRef(perfumeRow);

    const runId = `run-${crypto.randomUUID()}`;
    await db.insert(schema.researchRuns).values({
      id: runId,
      perfumeId: perfume.id,
      status: "running",
      step: "research",
      startedAt: now,
    });

    const finish = async (status: "completed" | "failed", step: string, extra: Record<string, unknown> = {}) => {
      await db
        .update(schema.researchRuns)
        .set({ status, step, finishedAt: new Date().toISOString(), ...extra })
        .where(eq(schema.researchRuns.id, runId));
    };

    // ── 1. Research (facts only) ──
    let research: Awaited<ReturnType<typeof collectFacts>>;
    try {
      research = await collectFacts(perfume);
    } catch (error) {
      await finish("failed", "research", { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }

    for (const source of research.used) {
      await db.insert(schema.reviewSources).values({
        id: `src-${crypto.randomUUID()}`,
        perfumeId: perfume.id,
        sourceType: source.kind,
        name: source.name,
        url: source.url ?? "",
        facts: JSON.stringify({ conflicts: source.conflicts }),
        lastChecked: now,
        httpStatus: 200,
      });
    }
    // Unreachable sources are recorded too. A review built on one source is not
    // the same as one built on four, and that gap should be visible later.
    for (const source of research.skipped) {
      await db.insert(schema.reviewSources).values({
        id: `src-${crypto.randomUUID()}`,
        perfumeId: perfume.id,
        sourceType: "community",
        name: source.name,
        url: "",
        facts: JSON.stringify({ skipped: true, reason: source.reason }),
        lastChecked: now,
      });
    }

    const status = await generationStatus(credentialCtx);
    if (!status.configured) {
      await finish("failed", "generation", {
        error: `review model not configured: missing ${status.missing.join(", ")}`,
        sourcesUsed: research.used.length,
        factsCollected: Object.keys(research.facts).length,
      });
      throw new ReviewGenerationNotConfiguredError(
        `Research completed for "${slug}" (${research.used.length} source(s) reachable, ` +
          `${Object.keys(research.facts).length} fact group(s) collected) but no review model is configured. ` +
          `Set ${status.missing.join(", ")} and run this action again. No draft was written.`,
      );
    }

    // ── 2. Prompt ──
    const knownSlugs = (await db.select({ slug: schema.perfumes.slug }).from(schema.perfumes))
      .map((r) => r.slug)
      .filter((s) => s !== slug);

    const prompt = buildReviewPrompt({
      perfume: {
        name: perfume.name,
        brand: perfume.brand,
        concentration: perfume.concentration,
        family: perfume.family,
        releaseYear: perfume.releaseYear,
        perfumer: perfume.perfumer,
      },
      notes: {
        top: research.facts.topNotes ?? perfume.topNotes,
        heart: research.facts.heartNotes ?? perfume.heartNotes,
        base: research.facts.baseNotes ?? perfume.baseNotes,
      },
      consensus: research.facts.performance
        ? {
            longevity: research.facts.performance.longevity,
            projection: research.facts.performance.projection,
            sillage: research.facts.performance.sillage,
            agreement: research.facts.performance.agreement,
            disagreement: research.facts.performance.disagreement,
          }
        : undefined,
      observations: research.facts.observations,
      sources: research.used.map((s) => ({ name: s.name, kind: s.kind, url: s.url })),
      conflicts: research.conflicts,
      knownSlugs,
    });

    // ── 3. Generate ──
    let sections: ReviewSections;
    let generatedMeta: { provider: string; model: string } = { provider: "", model: "" };
    try {
      const generated = await generateReview(prompt, credentialCtx);
      sections = generated.sections;
      generatedMeta = { provider: generated.provider, model: generated.model };
    } catch (error) {
      await finish("failed", "generation", {
        error: error instanceof Error ? error.message : String(error),
        sourcesUsed: research.used.length,
      });
      throw error;
    }

    // ── 4. Quality control ──
    const findings = runQc(sections);

    // ── 5. Store as DRAFT ──
    const previous = await db
      .select({ version: schema.editorialReviews.version })
      .from(schema.editorialReviews)
      .where(eq(schema.editorialReviews.perfumeId, perfume.id))
      .orderBy(desc(schema.editorialReviews.version))
      .limit(1);

    const reviewId = `rev-${crypto.randomUUID()}`;
    await db.insert(schema.editorialReviews).values({
      id: reviewId,
      perfumeId: perfume.id,
      version: (previous[0]?.version ?? 0) + 1,
      status: "draft",
      quickOverview: sections.quickOverview,
      scentDescription: sections.scentDescription,
      noteBreakdown: JSON.stringify(sections.noteBreakdown),
      scentProfile: JSON.stringify(sections.scentProfile),
      performance: sections.performance,
      fragranceDevelopment: sections.fragranceDevelopment,
      bestSeasons: JSON.stringify(sections.bestSeasons),
      bestOccasions: JSON.stringify(sections.bestOccasions),
      whoIsItFor: sections.whoIsItFor,
      strengths: JSON.stringify(sections.strengths),
      considerations: JSON.stringify(sections.considerations),
      value: sections.value,
      similarFragrances: JSON.stringify(sections.similarFragrances),
      take: sections.take,
      faq: JSON.stringify(sections.faq),
      model: `${generatedMeta.provider}/${generatedMeta.model}`,
      promptVersion: PROMPT_VERSION,
      qcReport: JSON.stringify(findings),
      sourcesCount: research.used.length,
      createdAt: now,
      updatedAt: now,
    });

    await db.update(schema.reviewSources).set({ reviewId }).where(eq(schema.reviewSources.perfumeId, perfume.id));

    await finish("completed", "qc", {
      sourcesUsed: research.used.length,
      factsCollected: Object.keys(research.facts).length,
    });

    return {
      reviewId,
      status: "draft",
      version: (previous[0]?.version ?? 0) + 1,
      sourcesUsed: research.used.map((s) => s.name),
      sourcesSkipped: research.skipped.map((s) => ({ name: s.name, reason: s.reason })),
      conflicts: research.conflicts,
      qc: {
        blocking: hasBlocking(findings),
        findings,
      },
      adapters: listAdapters().map((a) => ({ id: a.id, kind: a.kind, enabled: a.enabled, reason: a.disabledReason })),
    };
  },
});
