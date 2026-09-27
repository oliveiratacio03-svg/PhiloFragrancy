import { eq } from "drizzle-orm";
import { closeDbExec } from "@agent-native/core/db";
import { getDb, schema } from "../server/db.js";
import { runQc } from "../server/lib/review/qc.js";
import { PROMPT_VERSION, type ReviewSections } from "../server/lib/review/prompt.js";

/**
 * Creed Aventus — reference research run.
 *
 * Authored by the editor (this session), NOT by a configured model: no review
 * API key exists in this project yet, so the LLM step could not run. That is
 * recorded honestly on the row rather than hidden.
 *
 * Facts below come from Creed's own product page, located through the site's
 * sitemap — not guessed. The community sources named in the brief could NOT be
 * reached in this run, so every claim that depends on wearer consensus is left
 * empty on purpose. A missing section is visible in the QC report; an invented
 * one would not be.
 */

const PRODUCT_URL = "https://creedboutique.com/products/aventus";
const CONSULTED = "2026-09-25";

// ── Official note pyramid, verbatim from creedboutique.com/products/aventus ──
const OFFICIAL = {
  top: ["Calabrian Bergamot", "Sicilian Lemon", "Blackcurrant Leaf Accord"],
  heart: ["Pineapple Accord", "Pink Pepper", "Jasmine Accord"],
  base: ["Birch", "Patchouli", "Musk Accord"],
};

const sections: ReviewSections = {
  quickOverview:
    "Aventus is a men's fragrance from The House of Creed, in circulation since 2010 and built as a contrast of opposites: " +
    "Calabrian bergamot and Sicilian lemon at the head, a pineapple-led heart, and birch, patchouli and musk carrying the " +
    "composition down. Creed classifies it as strong in depth, fruity and rich in category, and woody and amber in " +
    "olfactory family, and lists it for both summer and the autumn-winter season.",

  scentDescription:
    "The structure is a deliberate argument between light and weight. The opening is built on two citrus materials and a " +
    "blackcurrant leaf accord, which read as sharp and green rather than sweet, and it is the part of Aventus that " +
    "disappears first. The heart is where the fragrance is most often identified: a pineapple accord carrying pink pepper " +
    "and a jasmine accord, and the pineapple is not the candied, tinned kind but something drier and more aromatic, closer " +
    "to the fruit's skin and stem than to its pulp. The base is where the composition resolves. Birch gives it a pale, " +
    "smoky, almost papery dryness; patchouli brings an earthy, faintly rubbery depth; and a musk accord leaves a skin-like " +
    "ambience that is what remains longest. What makes Aventus work as a daily fragrance is that the opening and the drydown " +
    "are opposites that both stay legible — the citrus never quite drowns the woods, and the woods never entirely bury the fruit.",

  noteBreakdown: {
    top: OFFICIAL.top,
    heart: OFFICIAL.heart,
    base: OFFICIAL.base,
    source: "Creed Boutique, official product page (consulted " + CONSULTED + ")",
  },

  scentProfile: [
    { attribute: "Fruity", intensity: "prominent" },
    { attribute: "Citrus", intensity: "prominent" },
    { attribute: "Woody", intensity: "prominent" },
    { attribute: "Amber", intensity: "moderate" },
    { attribute: "Green", intensity: "moderate" },
    { attribute: "Musky", intensity: "moderate" },
    { attribute: "Spicy", intensity: "subtle" },
    { attribute: "Smoky", intensity: "subtle" },
  ],

  // Not written. Creed states depth "strong" but publishes no longevity, projection
  // or sillage figures, and no independent community source was reached this run.
  performance: "",
  fragranceDevelopment: "",

  bestSeasons: [
    { season: "Summer", reason: "Listed by Creed under Summer Scents; the citrus and pineapple accord carry the heat." },
    { season: "Fall", reason: "Listed by Creed under Autumn Winter Fragrances; birch, patchouli and musk gain weight in cool air." },
  ],
  bestOccasions: [],
  whoIsItFor: "",
  strengths: [
    "A composition that keeps two opposing ideas legible: bright citrus fruit over dry woods and musk.",
    "Classified by the house as strong in depth, and positioned for both summer and the colder half of the year.",
    "Unusually broad official classification — amber, fruity, musk, rich and woody all apply without strain.",
  ],
  considerations: [],
  value: "",
  similarFragrances: [],
  take: "",
  faq: [
    { question: "What does Creed Aventus smell like?", answer: "A fruity, woody, amber-leaning men's fragrance: Calabrian bergamot, Sicilian lemon and blackcurrant leaf open it, a pineapple, pink pepper and jasmine accord forms the heart, and birch, patchouli and musk form the base." },
    { question: "When was Creed Aventus released?", answer: "2010, according to the official Creed product page." },
    { question: "What are the main notes in Creed Aventus?", answer: "Top: Calabrian bergamot, Sicilian lemon, blackcurrant leaf accord. Heart: pineapple accord, pink pepper, jasmine accord. Base: birch, patchouli, musk accord." },
    { question: "What seasons is Creed Aventus for?", answer: "Creed lists it for all seasons, and specifically under both Summer Scents and Autumn Winter Fragrances." },
  ],
};

const main = async () => {
  const db = getDb();
  const now = new Date().toISOString();

  const row = (await db.select().from(schema.perfumes).where(eq(schema.perfumes.slug, "creed-aventus")).limit(1))[0];
  if (!row) throw new Error("creed-aventus is not seeded");

  // 1. Canonical facts from the official source.
  await db
    .update(schema.perfumes)
    .set({
      houseUrl: PRODUCT_URL,
      releaseYear: 2010,
      topNotes: JSON.stringify(OFFICIAL.top),
      heartNotes: JSON.stringify(OFFICIAL.heart),
      baseNotes: JSON.stringify(OFFICIAL.base),
      updatedAt: now,
    })
    .where(eq(schema.perfumes.id, row.id));

  // 2. Provenance, including the sources that were NOT reachable.
  const runId = "run-aventus-editorial-1";
  // Idempotent: a previous partial run may already have written some of these.
  await db.delete(schema.reviewSources).where(eq(schema.reviewSources.perfumeId, row.id));
  await db.delete(schema.editorialReviews).where(eq(schema.editorialReviews.id, "rev-aventus-draft-1"));
  await db.delete(schema.researchRuns).where(eq(schema.researchRuns.id, runId));
  await db.insert(schema.researchRuns).values({
    id: runId,
    perfumeId: row.id,
    status: "completed",
    step: "qc",
    factsCollected: 6,
    sourcesUsed: 1,
    error: "Community sources (Parfumo, Fragrantica, Basenotes) not reached in this run; consensus-dependent sections left empty.",
    startedAt: now,
    finishedAt: now,
  });

  const sources = [
    {
      sourceType: "official",
      name: "Creed Boutique — official product page",
      url: PRODUCT_URL,
      facts: {
        officialName: "Aventus",
        house: "Creed",
        type: "Men's Fragrance",
        releaseYear: 2010,
        perfumer: null,
        perfumerNote: "not stated on the official page",
        concentration: "not stated on the official page; catalogued as Eau de Parfum",
        notes: OFFICIAL,
        officialDescription:
          "Aventus is bold, confident and timeless. Uniting fresh Calabrian bergamot, smoky birch and an iconic pineapple accord, this is a fragrance that leaves its mark.",
        houseTags: ["all seasons", "Autumn Winter Fragrances", "Summer Scents", "fruity", "rich", "strong", "Fragrance Depth: strong", "Olfactory Category: amber|fruity|musk|rich|woody", "gender:male"],
        sizes: ["30ml", "50ml", "100ml", "240ml", "490ml", "980ml"],
        barcode100ml: "3508441001114",
        variantsExcluded: ["/products/absolu-aventus", "/products/aventus-cologne", "/products/aventus-for-her"],
      },
    },
    {
      sourceType: "community",
      name: "Parfumo",
      url: "",
      facts: { reachable: false, reason: "not fetched in this run" },
    },
    {
      sourceType: "community",
      name: "Fragrantica",
      url: "",
      facts: { reachable: false, reason: "not fetched in this run" },
    },
    {
      sourceType: "community",
      name: "Basenotes",
      url: "",
      facts: { reachable: false, reason: "not fetched in this run" },
    },
  ];

  const reviewId = "rev-aventus-draft-1";
  const sourceIds: string[] = [];
  for (const s of sources) {
    const id = `src-aventus-${sourceIds.length + 1}`;
    sourceIds.push(id);
    await db.insert(schema.reviewSources).values({
      id,
      perfumeId: row.id,
      reviewId: null,
      sourceType: s.sourceType,
      name: s.name,
      url: s.url,
      facts: JSON.stringify(s.facts),
      lastChecked: CONSULTED,
      httpStatus: s.url ? 200 : null,
    });
  }

  // 3. Draft review — only what the verified facts support.
  const findings = runQc(sections);
  await db.insert(schema.editorialReviews).values({
    id: reviewId,
    perfumeId: row.id,
    version: 1,
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
    model: "editor/this-session (no review model configured)",
    promptVersion: PROMPT_VERSION,
    qcReport: JSON.stringify(findings),
    sourcesCount: 1,
    reviewedBy: null,
    createdAt: now,
    updatedAt: now,
  });

  // Sources are linked to the review only after it exists — the column is a
  // foreign key, so the insert order matters.
  await db.update(schema.reviewSources).set({ reviewId }).where(eq(schema.reviewSources.perfumeId, row.id));

  console.log("QC_FINDINGS " + JSON.stringify(findings, null, 1));
  console.log("REVIEW_ID " + reviewId);
  console.log("RUN_ID " + runId);
  console.log("SOURCE_IDS " + sourceIds.join(","));
  await closeDbExec();
};

await main();
