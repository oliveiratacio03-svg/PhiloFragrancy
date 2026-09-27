import { Link, useParams } from "react-router";

import { PERFUMES } from "@/data/coupons";
import { dealForSlug, formatMoney, PRICING_IS_SAMPLE } from "@/data/deals";

import { SampleNote } from "@/components/deal/Money";
import { WishButton } from "@/components/deal/WishButton";

export function meta({ params }: { params: { slug: string } }) {
  const perfume = PERFUMES.find((p) => p.slug === params.slug);
  if (!perfume) return [{ title: "Fragrance Not Found — PhiloFragrancy" }];

  return [
    { title: `${perfume.name} by ${perfume.brand} — Compare Offers | PhiloFragrancy` },
    {
      name: "description",
      content: `Every retailer offer listed for ${perfume.name} by ${perfume.brand}, side by side, with the full note pyramid and the independent review.`,
    },
    { name: "robots", content: "noindex, follow" },
  ];
}

/**
 * The detailed comparison for one fragrance.
 *
 * It reads the same `deals.ts` the homepage reads. That is deliberate even
 * though a `retailer_offers` table already exists in the database: a page that
 * mixed sample prices on one surface with stored prices on another would show
 * two different numbers for the same bottle and no label to explain which was
 * which. When real offers replace the sample set, both surfaces change at once
 * because there is only one source.
 */
export default function CompareRoute() {
  const { slug } = useParams();
  const perfume = PERFUMES.find((p) => p.slug === slug);

  if (!perfume) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#070707] p-8 text-center">
        <h1 className="pf-h2">Fragrance not found</h1>
        <p className="pf-lede mt-4 max-w-[420px]">
          That comparison does not exist. It may be a fragrance we have not added yet.
        </p>
        <Link to="/search" className="pf-btn mt-8">
          Search the collection
        </Link>
      </div>
    );
  }

  const deal = dealForSlug(perfume.slug);
  const offers = deal?.offers ?? [];
  const checked = offers.filter((o) => o.priceCents !== null);

  return (
    <div className="w-full bg-[#070707] text-[#e5e5e7]">
      <section className="border-b border-white/10">
        <div className="pf-container grid gap-10 py-14 md:grid-cols-[280px_1fr] md:py-16">
          <div className="pf-card__media aspect-square bg-white p-8">
            {perfume.image ? (
              <img src={perfume.image} alt={`${perfume.brand} ${perfume.name}`} />
            ) : (
              <div className="pf-packshot-empty">
                <span className="pf-packshot-empty__brand">{perfume.brand}</span>
                <span className="pf-packshot-empty__name">{perfume.name}</span>
              </div>
            )}
          </div>

          <div>
            <p className="pf-eyebrow">{perfume.brand}</p>
            <h1 className="pf-h2 mt-3">{perfume.name}</h1>
            <p className="pf-meta mt-3">
              {perfume.concentration} · {perfume.family}
            </p>
            <p className="pf-lede mt-6 max-w-[620px]">{perfume.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={`/perfumes/${perfume.slug}`} className="pf-btn">
                Read the review
              </Link>
              <WishButton slug={perfume.slug} name={perfume.name} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Offers ── */}
      <section className="pf-section">
        <div className="pf-container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="pf-h3 text-[1.6rem]">Where it is listed</h2>
            <SampleNote />
          </div>

          {offers.length === 0 ? (
            /* Honest empty state: no invented rows, and it points at the two
               things that would actually change it. */
            <div className="mt-8 max-w-[560px] border-t border-white/10 pt-8">
              <p className="pf-lede">
                We do not list a retailer offer for this fragrance yet. Nothing is
                withheld here — there is genuinely nothing checked to show.
              </p>
              <div className="mt-6 flex flex-wrap gap-6">
                <Link to={`/perfumes/${perfume.slug}`} className="pf-cta">
                  Read the review <span className="pf-arrow">→</span>
                </Link>
                <Link to="/#compare" className="pf-cta">
                  See what we can price <span className="pf-arrow">→</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 max-w-[760px]">
              {offers.map((offer) => (
                <div key={offer.retailer} className="pf-offer">
                  <div>
                    <p className="pf-offer__retailer">{offer.retailer}</p>
                    <p className="pf-offer__price">
                      {offer.priceCents === null ? (
                        <span className="pf-deal__unlisted">Price not recorded</span>
                      ) : (
                        <>
                          {formatMoney(offer.priceCents)}
                          {offer.referencePriceCents !== null && (
                            <s>{formatMoney(offer.referencePriceCents)}</s>
                          )}
                        </>
                      )}
                    </p>
                    {offer.discountLabel && <span className="pf-tag pf-tag--gold mt-2">{offer.discountLabel}</span>}
                  </div>

                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="pf-btn whitespace-nowrap"
                  >
                    Shop at {offer.retailer}
                    <span className="sr-only"> {perfume.name} (opens in a new tab)</span>
                  </a>
                </div>
              ))}

              {checked.length < offers.length && (
                <p className="pf-meta mt-6">
                  {offers.length - checked.length} of {offers.length} retailers have no price
                  recorded yet.
                </p>
              )}

              {PRICING_IS_SAMPLE && (
                <p className="pf-lede mt-8 max-w-[620px] text-[0.8rem]">
                  These figures are placeholders. The retailer sets the real price at
                  checkout, and following the link takes you to their page — not to a
                  cart we hold.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Notes ── */}
      <section className="pf-section border-t border-white/10">
        <div className="pf-container">
          <h2 className="pf-h3 text-[1.6rem]">Note pyramid</h2>
          <div className="mt-8 grid max-w-[900px] gap-8 sm:grid-cols-3">
            {(
              [
                ["Top", perfume.topNotes],
                ["Heart", perfume.heartNotes],
                ["Base", perfume.baseNotes],
              ] as const
            ).map(([stage, notes]) => (
              <div key={stage}>
                <p className="pf-eyebrow">{stage}</p>
                <ul className="mt-4">
                  {notes.map((note) => (
                    <li
                      key={note}
                      className="border-b border-white/10 py-2.5 text-[0.92rem] text-white/80"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-[900px]">
            <Link to="/search" className="pf-cta">
              Search another fragrance <span className="pf-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
