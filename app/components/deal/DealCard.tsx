import { Link } from "react-router";

import { PERFUMES } from "@/data/coupons";
import type { Deal } from "@/data/deals";

import { Money } from "./Money";
import { WishButton } from "./WishButton";

/**
 * One fragrance, every retailer we list for it, and exactly one way onward.
 *
 * The card has no coupon box and no copy-to-clipboard button. Those were
 * specified and then cut: this site does not issue discount codes, and a
 * "reveal code" affordance that copies a string no retailer honours is not a
 * conversion feature, it is a broken promise with a green flash on it. The
 * reader follows the retailer link and the retailer applies whatever is real.
 */
export function DealCard({ deal }: { deal: Deal }) {
  const perfume = PERFUMES.find((p) => p.slug === deal.slug);
  if (!perfume) return null;

  return (
    <article className="pf-deal">
      <Link
        to={`/perfumes/${perfume.slug}`}
        className="pf-card__media aspect-[4/3] p-6"
        tabIndex={-1}
        aria-hidden="true"
      >
        {perfume.image ? (
          <img src={perfume.image} alt="" loading="lazy" />
        ) : (
          <div className="pf-packshot-empty">
            <span className="pf-packshot-empty__brand">{perfume.brand}</span>
            <span className="pf-packshot-empty__name">{perfume.name}</span>
          </div>
        )}
      </Link>

      <div className="pf-deal__body">
        <p className="pf-meta">{perfume.brand}</p>
        <h3 className="pf-h3 mt-2 text-[1.55rem]">
          {/* The image link above is aria-hidden, so the name has to be the
              real link to the review — otherwise the card has no keyboard path. */}
          <Link to={`/perfumes/${perfume.slug}`} className="pf-link">
            {perfume.name}
          </Link>
        </h3>
        <p className="pf-meta mt-1.5">{perfume.concentration}</p>

        <div className="mt-5 flex-1">
          {deal.offers.map((offer) => (
            <div key={offer.retailer} className="pf-deal__row">
              <div>
                <p className="pf-deal__retailer">{offer.retailer}</p>
                <Money cents={offer.priceCents} />
                {offer.referencePriceCents !== null && offer.priceCents !== null && (
                  <s className="pf-deal__price" style={{ fontSize: "0.75rem" }}>
                    ${(offer.referencePriceCents / 100).toFixed(2)}
                  </s>
                )}
              </div>
              <a
                href={offer.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="pf-cta whitespace-nowrap"
              >
                Shop <span className="pf-arrow">→</span>
                <span className="sr-only">
                  {" "}
                  {perfume.name} at {offer.retailer} (opens in a new tab)
                </span>
              </a>
            </div>
          ))}
        </div>

        <p className="pf-meta mt-4 border-t border-white/10 pt-4">{deal.demand}</p>

        <div className="mt-4 flex gap-3">
          <Link to={`/compare/${perfume.slug}`} className="pf-btn flex-1">
            Compare
          </Link>
          <WishButton slug={perfume.slug} name={perfume.name} />
        </div>
      </div>
    </article>
  );
}
