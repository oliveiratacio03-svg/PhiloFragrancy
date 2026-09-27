import { boolean, index, integer, table, text, uniqueIndex, now } from "@agent-native/core/db/schema";

/**
 * PhiloFragrance data model.
 *
 * The hard rule this schema encodes: EDITORIAL FACTS AND RETAILER DATA NEVER
 * MIX. A price, a discount or an affiliate URL may only ever live in
 * `retailerOffers`. Prose in `editorialReviews` may reference them by
 * relationship, never by value. That separation is what lets a review be
 * rewritten without touching commercial data, and it is what the review
 * quality-control check enforces.
 *
 * List-shaped values (note pyramids, attribute tags, FAQ pairs) are stored as
 * JSON text and parsed in the data layer, so the schema stays portable across
 * libSQL and hosted Postgres without array-type assumptions.
 */

export const perfumes = table(
  "perfumes",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    brand: text("brand").notNull(),
    concentration: text("concentration").notNull(),
    family: text("family").notNull(),

    /** Official house page. Authoritative for notes, year and perfumer. */
    houseUrl: text("house_url"),
    releaseYear: integer("release_year"),
    perfumer: text("perfumer"),

    topNotes: text("top_notes").notNull().default("[]"),
    heartNotes: text("heart_notes").notNull().default("[]"),
    baseNotes: text("base_notes").notNull().default("[]"),

    image: text("image"),

    createdAt: text("created_at").notNull().default(now()),
    updatedAt: text("updated_at").notNull().default(now()),
  },
  (t) => [uniqueIndex("perfumes_slug_key").on(t.slug), index("perfumes_brand_idx").on(t.brand)],
);

/**
 * One row per review version. Versions are immutable once published; an edit
 * creates a new row and supersedes the old one, so the published copy can be
 * reproduced and diffed later.
 *
 * `status` gates publication: the generator only ever writes `draft`. Nothing
 * reaches the public product page until a human promotes it, which is what
 * keeps an unreviewed machine draft off the site.
 */
export const editorialReviews = table(
  "editorial_reviews",
  {
    id: text("id").primaryKey(),
    perfumeId: text("perfume_id")
      .notNull()
      .references(() => perfumes.id),
    version: integer("version").notNull().default(1),
    status: text("status").notNull().default("draft"), // draft | published | superseded

    // ── The fifteen sections ──
    quickOverview: text("quick_overview").notNull().default(""),
    scentDescription: text("scent_description").notNull().default(""),
    noteBreakdown: text("note_breakdown").notNull().default("{}"),
    scentProfile: text("scent_profile").notNull().default("{}"),
    performance: text("performance").notNull().default(""),
    fragranceDevelopment: text("fragrance_development").notNull().default(""),
    bestSeasons: text("best_seasons").notNull().default("[]"),
    bestOccasions: text("best_occasions").notNull().default("[]"),
    whoIsItFor: text("who_is_it_for").notNull().default(""),
    strengths: text("strengths").notNull().default("[]"),
    considerations: text("considerations").notNull().default("[]"),
    value: text("value").notNull().default(""),
    similarFragrances: text("similar_fragrances").notNull().default("[]"),
    take: text("take").notNull().default(""),
    faq: text("faq").notNull().default("[]"),

    // ── Provenance and accountability ──
    model: text("model").notNull().default(""),
    promptVersion: text("prompt_version").notNull().default(""),
    /** Output of the automated quality-control pass. `[]` means clean. */
    qcReport: text("qc_report").notNull().default("[]"),
    sourcesCount: integer("sources_count").notNull().default(0),
    reviewedBy: text("reviewed_by"),
    publishedAt: text("published_at"),

    createdAt: text("created_at").notNull().default(now()),
    updatedAt: text("updated_at").notNull().default(now()),
  },
  (t) => [
    index("editorial_reviews_perfume_idx").on(t.perfumeId),
    index("editorial_reviews_status_idx").on(t.status),
  ],
);

/**
 * Where a fact came from. We store the extracted FACT, never the source prose,
 * and we store when it was checked so a stale claim can be spotted.
 */
export const reviewSources = table(
  "review_sources",
  {
    id: text("id").primaryKey(),
    perfumeId: text("perfume_id")
      .notNull()
      .references(() => perfumes.id),
    reviewId: text("review_id").references(() => editorialReviews.id),

    sourceType: text("source_type").notNull(), // official | database | community | publication
    name: text("name").notNull(),
    url: text("url").notNull(),

    /** JSON: the facts lifted from this source, plus any conflicts noticed. */
    facts: text("facts").notNull().default("{}"),
    lastChecked: text("last_checked"),
    httpStatus: integer("http_status"),

    createdAt: text("created_at").notNull().default(now()),
  },
  (t) => [index("review_sources_perfume_idx").on(t.perfumeId)],
);

/**
 * Commercial data. A fragrance has many offers; an offer belongs to one
 * retailer and carries its own affiliate URL and check timestamp. Editorial
 * prose must never contain a price — it reads offers through this table.
 */
export const retailerOffers = table(
  "retailer_offers",
  {
    id: text("id").primaryKey(),
    perfumeId: text("perfume_id")
      .notNull()
      .references(() => perfumes.id),
    retailer: text("retailer").notNull(),
    affiliateUrl: text("affiliate_url").notNull(),

    /** Minor units (cents) so money never round-trips through a float. */
    priceCents: integer("price_cents"),
    originalPriceCents: integer("original_price_cents"),
    currency: text("currency").notNull().default("USD"),

    discountLabel: text("discount_label"),
    availability: text("availability").notNull().default("unknown"), // in_stock | out_of_stock | unknown
    lastChecked: text("last_checked"),
    isPrimary: boolean("is_primary").notNull().default(false),

    createdAt: text("created_at").notNull().default(now()),
    updatedAt: text("updated_at").notNull().default(now()),
  },
  (t) => [index("retailer_offers_perfume_idx").on(t.perfumeId)],
);

/** One row per pipeline execution, so a failed or partial run is visible. */
export const researchRuns = table(
  "research_runs",
  {
    id: text("id").primaryKey(),
    perfumeId: text("perfume_id")
      .notNull()
      .references(() => perfumes.id),
    status: text("status").notNull().default("running"), // running | completed | failed
    step: text("step").notNull().default("queued"),
    factsCollected: integer("facts_collected").notNull().default(0),
    sourcesUsed: integer("sources_used").notNull().default(0),
    error: text("error"),
    startedAt: text("started_at").notNull().default(now()),
    finishedAt: text("finished_at"),
  },
  (t) => [index("research_runs_perfume_idx").on(t.perfumeId)],
);
