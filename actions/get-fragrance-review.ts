import { defineAction } from "@agent-native/core/action";
import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

/**
 * Read the stored editorial review for a fragrance, plus its retailer offers.
 *
 * Published copy is the default. `includeDraft` exists so an editor can preview
 * an unpublished review in place — the response then carries `status` and the
 * page renders a draft banner. There is no parameter that turns a draft into
 * published copy; that is a separate, deliberate act.
 *
 * Editorial and retail data travel in one payload but stay separate objects, so
 * a price change never requires touching prose and a prose rewrite never
 * requires touching prices.
 */
export default defineAction({
  description: "Fetch the PhiloFragrance editorial review and retailer offers for a fragrance by slug.",
  schema: z.object({
    slug: z.string().min(1).describe("Slug of the fragrance"),
    includeDraft: z
      .boolean()
      .optional()
      .describe("Return the newest draft when no published review exists. Editor preview only."),
  }),
  http: { method: "GET" },
  run: async ({ slug, includeDraft }) => {
    const db = getDb();

    const perfumeRows = await db.select().from(schema.perfumes).where(eq(schema.perfumes.slug, slug)).limit(1);
    const perfume = perfumeRows[0];
    if (!perfume) return null;

    const wanted = includeDraft ? ["published", "draft"] : ["published"];
    const reviewRows = await db
      .select()
      .from(schema.editorialReviews)
      .where(and(eq(schema.editorialReviews.perfumeId, perfume.id), inArray(schema.editorialReviews.status, wanted)))
      .orderBy(desc(schema.editorialReviews.version))
      .limit(1);
    const review = reviewRows[0];

    const offerRows = await db.select().from(schema.retailerOffers).where(eq(schema.retailerOffers.perfumeId, perfume.id));

    const parse = <T,>(raw: string, fallback: T): T => {
      try {
        return JSON.parse(raw) as T;
      } catch {
        return fallback;
      }
    };

    return {
      perfume: {
        slug: perfume.slug,
        name: perfume.name,
        brand: perfume.brand,
        concentration: perfume.concentration,
        family: perfume.family,
        releaseYear: perfume.releaseYear,
        perfumer: perfume.perfumer,
        image: perfume.image,
      },
      review: review
        ? {
            id: review.id,
            version: review.version,
            status: review.status,
            model: review.model,
            promptVersion: review.promptVersion,
            sourcesCount: review.sourcesCount,
            publishedAt: review.publishedAt,
            sections: {
              quickOverview: review.quickOverview,
              scentDescription: review.scentDescription,
              noteBreakdown: parse(review.noteBreakdown, { top: [], heart: [], base: [], source: "" }),
              scentProfile: parse<{ attribute: string; intensity: string }[]>(review.scentProfile, []),
              performance: review.performance,
              fragranceDevelopment: review.fragranceDevelopment,
              bestSeasons: parse<{ season: string; reason: string }[]>(review.bestSeasons, []),
              bestOccasions: parse<{ occasion: string; reason: string }[]>(review.bestOccasions, []),
              whoIsItFor: review.whoIsItFor,
              strengths: parse<string[]>(review.strengths, []),
              considerations: parse<string[]>(review.considerations, []),
              value: review.value,
              similarFragrances: parse<string[]>(review.similarFragrances, []),
              take: review.take,
              faq: parse<{ question: string; answer: string }[]>(review.faq, []),
            },
            /** Non-empty sections only — the renderer skips the rest rather than
             *  printing an empty heading. */
            completedSections: [
              "quickOverview",
              "scentDescription",
              "performance",
              "fragranceDevelopment",
              "whoIsItFor",
              "value",
              "take",
            ].filter((key) => {
              const value = (review as unknown as Record<string, string>)[key];
              return typeof value === "string" && value.trim().length > 0;
            }).length,
            qc: parse<{ check: string; severity: string; detail: string }[]>(review.qcReport, []),
          }
        : null,
      offers: offerRows.map((o) => ({
        id: o.id,
        retailer: o.retailer,
        affiliateUrl: o.affiliateUrl,
        price: o.priceCents === null ? null : o.priceCents / 100,
        referencePrice: o.originalPriceCents === null ? null : o.originalPriceCents / 100,
        currency: o.currency,
        discountLabel: o.discountLabel,
        availability: o.availability,
        lastChecked: o.lastChecked,
      })),
    };
  },
});
