import { eq } from "drizzle-orm";

import { getDb, schema } from "../../db.js";
import { PERFUMES, COUPONS } from "../../../app/data/coupons.js";

/**
 * Import the legacy catalog into the canonical tables.
 *
 * What is NOT migrated, on purpose: `fullReview`, `expertVerdict`, `pros`,
 * `cons` and the invented `rating` / `reviewCount`. Those are editorial prose
 * and unsourced community claims. They stay in the legacy file and are not
 * promoted into `editorial_reviews`, which is the only place published copy
 * may come from.
 *
 * Prices become `retailer_offers` rows so commercial data is queryable and
 * checkable on its own, never embedded in prose.
 */
/**
 * Official house pages, which the research pipeline treats as the authoritative
 * publisher of a note pyramid.
 *
 * Only verified domains belong here. A wrong entry would let the pipeline
 * attribute notes to a house that never published them, which is worse than no
 * entry at all — so an unverified brand is simply absent and shows up in the
 * seed's `missingHouseUrl` report.
 */
const HOUSE_URLS: Record<string, string> = {
  Creed: "https://www.creedboutique.com/",
};

export async function seedCatalog(): Promise<{
  perfumes: number;
  offers: number;
  created: number;
  updated: number;
  missingHouseUrl: string[];
}> {
  const db = getDb();
  const now = new Date().toISOString();
  const summary = { perfumes: 0, offers: 0, created: 0, updated: 0, missingHouseUrl: [] as string[] };

  for (const perfume of PERFUMES) {
    const existing = await db
      .select({ id: schema.perfumes.id })
      .from(schema.perfumes)
      .where(eq(schema.perfumes.slug, perfume.slug))
      .limit(1);

    const values = {
      slug: perfume.slug,
      name: perfume.name,
      brand: perfume.brand,
      concentration: perfume.concentration,
      family: perfume.family,
      houseUrl: HOUSE_URLS[perfume.brand] ?? (null as string | null),
      topNotes: JSON.stringify(perfume.topNotes),
      heartNotes: JSON.stringify(perfume.heartNotes),
      baseNotes: JSON.stringify(perfume.baseNotes),
      image: perfume.image ?? null,
      updatedAt: now,
    };

    let perfumeId: string;
    if (existing[0]) {
      await db.update(schema.perfumes).set(values).where(eq(schema.perfumes.id, existing[0].id));
      perfumeId = existing[0].id;
      summary.updated += 1;
    } else {
      perfumeId = perfume.id;
      await db.insert(schema.perfumes).values({ id: perfumeId, createdAt: now, ...values });
      summary.created += 1;
    }
    summary.perfumes += 1;

    // The official house URL is the only source the research pipeline will
    // actually fetch, and it is the authoritative publisher of the note
    // pyramid. It is deliberately not guessed: an editor supplies it, and the
    // seed reports the gaps so they stay visible.
    if (!HOUSE_URLS[perfume.brand]) summary.missingHouseUrl.push(perfume.slug);

    const coupon = COUPONS.find((c) => c.perfumeId === perfume.id);
    if (!coupon) continue;

    const offerExists = await db
      .select({ id: schema.retailerOffers.id })
      .from(schema.retailerOffers)
      .where(eq(schema.retailerOffers.affiliateUrl, coupon.retailLink))
      .limit(1);
    if (offerExists[0]) continue;

    await db.insert(schema.retailerOffers).values({
      id: `offer-${coupon.id}`,
      perfumeId,
      retailer: coupon.retailer,
      affiliateUrl: coupon.retailLink,
      priceCents: Math.round(perfume.discountedPrice * 100),
      originalPriceCents: Math.round(perfume.originalPrice * 100),
      currency: "USD",
      discountLabel: coupon.discount,
      availability: "unknown",
      lastChecked: now,
      isPrimary: true,
    });
    summary.offers += 1;
  }

  return summary;
}
