import { Link } from "react-router";

export function meta() {
  return [
    { title: "Affiliate Disclosure — PhiloFragrancy" },
    {
      name: "description",
      content:
        "PhiloFragrancy earns a commission from some retailer links at no cost to the reader. It does not change the price you pay, and it does not buy a position in a review.",
    },
  ];
}

export default function DisclosureRoute() {
  return (
    <div className="w-full bg-[#070707] text-[#e5e5e7]">
      <section className="pf-section">
        <div className="pf-container-narrow">
          <p className="pf-eyebrow">Transparency</p>
          <h1 className="pf-h1 mt-5 text-[clamp(2.4rem,5vw,3.4rem)]">Affiliate &amp; commercial disclosure</h1>

          <div className="pf-prose mt-10">
            <p>
              PhiloFragrancy earns money when you buy something after following one of our
              retailer links. It costs you nothing extra and it does not change the price you
              pay. This page says exactly how that works, and — just as importantly — what we
              do not claim.
            </p>

            <h2>What earns us money</h2>
            <p>
              Retailer links on product pages, the offer cards and the comparison table. When
              you follow one and complete a purchase, the retailer may pay us a commission. We
              do not sell fragrance, we never take an order, and we hold no stock.
            </p>
            <p>
              Every retailer link is marked as an affiliate link. You can see it in the
              &ldquo;where to buy&rdquo; card on a product page, in the footer of every
              comparison, and in the link&rsquo;s own URL.
            </p>

            <h2>What a commission does not buy</h2>
            <p>
              It does not buy a position in a review, and it does not buy a rating — because
              we do not publish ratings. There is no star score and no review count on any
              page here, because we have no verified ratings to count. If a commission
              influenced what we wrote about a fragrance, the honest response would be to
              stop writing about it, not to add a disclaimer.
            </p>
            <p>
              Editorial prose and commercial data are stored separately in our database. A
              retailer price changing cannot alter a sentence in a review, and rewriting a
              review cannot move a price.
            </p>

            <h2>Prices on this site</h2>
            <p>
              Where a price appears next to a retailer, it is labelled as example pricing
              until a checked retailer feed replaces it. We do not run a daily price
              verification process, and we do not claim to. The retailer sets the price at
              their checkout, and their figure is the real one.
            </p>
            <p>
              This page previously stated that our team verified promotional codes and pricing
              daily with authorised distributors. No such process exists. A disclosure page
              that misdescribes its own operation is worse than no disclosure page at all,
              because it lends credibility to everything else on the site.
            </p>

            <h2>Discount codes</h2>
            <p>
              We do not issue discount codes, and we do not display any. If a code appears
              anywhere on this site, treat it as a mistake and tell us.
            </p>
          </div>

          <div className="mt-16 border-t border-white/10 pt-8">
            <Link to="/" className="pf-link pf-link--gold text-[0.8rem] tracking-[0.12em] uppercase">
              Return to homepage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
