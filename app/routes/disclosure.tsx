import { Link } from "react-router";

export function meta() {
  return [
    { title: "Affiliate Disclosure & Advertising Transparency — PhiloFragrancy" },
    {
      name: "description",
      content:
        "PhiloFragrancy affiliate disclosure, advertising ethics, and commercial relationship transparency in accordance with FTC guidelines and Google Ads standards.",
    },
  ];
}

export default function DisclosureRoute() {
  return (
    <div className="w-full bg-[#070707] text-[#e5e5e7]">
      <section className="pf-section">
        <div className="pf-container-narrow">
          <p className="pf-eyebrow">Transparency &amp; integrity</p>
          <h1 className="pf-h1 mt-5 text-[clamp(2.4rem,5vw,3.4rem)]">Affiliate &amp; commercial disclosure</h1>

          <div className="pf-prose mt-10">
            <p>
              In accordance with Federal Trade Commission (FTC) guidelines and Google Advertising Transparency
              policies, PhiloFragrancy operates with full commercial disclosure across all published content.
            </p>

            <h2>Affiliate relationships</h2>
            <p>
              PhiloFragrancy is reader-supported. Some of the links featured on our website (including coupon code
              buttons, deal links, and product packshot banners) are affiliate links. When you click these links and make
              a purchase on a partner merchant&rsquo;s website, PhiloFragrancy may earn a referral commission at no
              additional cost to you.
            </p>

            <h2>Editorial independence</h2>
            <p>
              Our editorial ratings, fragrance scores, longevity wear-test metrics, and fragrance reviews are 100%
              independent. Retailers, manufacturers, and perfume brands do not pay for positive evaluations. If a
              fragrance performs poorly in our testing or suffers from high dilution, we state so unequivocally in our
              review.
            </p>

            <h2>Pricing &amp; coupon accuracy</h2>
            <p>
              While our team verifies promotional codes and pricing daily with authorized distributors, prices and stock
              availability fluctuate rapidly. We recommend confirming final discount totals at the merchant&rsquo;s
              checkout before completing your transaction.
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
