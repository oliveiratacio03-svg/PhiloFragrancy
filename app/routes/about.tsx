import { Link } from "react-router";

export function meta() {
  return [
    { title: "About — PhiloFragrancy" },
    {
      name: "description",
      content:
        "PhiloFragrancy is an independent fragrance guide. We describe compositions, list the retailer offers we can find, and take no position we cannot support.",
    },
  ];
}

export default function AboutRoute() {
  return (
    <div className="w-full bg-[#070707] text-[#e5e5e7]">
      <section className="pf-section">
        <div className="pf-container-narrow">
          <p className="pf-eyebrow">What this is</p>
          <h1 className="pf-h1 mt-5 text-[clamp(2.6rem,6vw,4rem)]">About PhiloFragrancy</h1>

          <div className="pf-prose mt-10">
            <p>
              PhiloFragrancy is an independent guide to fragrance. We describe what a
              composition is made of, explain how it is likely to behave, and point you at
              the retailers we list. We do not sell fragrance and we never take an order.
            </p>
            <p>
              This page used to describe a testing laboratory, a 48-hour wear-testing cycle
              conducted on cotton blotters, and guaranteed authenticity warranties from our
              retail partners. None of that exists. Nobody here has a lab, no bottle has
              been blotted, and a guarantee issued by a retailer is not ours to give. We
              removed it because a reader arriving on a page like this has no way to check
              any of it, which is exactly why it should not be there.
            </p>

            <h2>How we write a review</h2>
            <ul>
              <li>
                <strong>We describe, we do not measure.</strong> Notes, concentration,
                scent family, release year and perfumer are public facts. We use them. We do
                not publish hours on skin or a projection distance, because we have not
                measured any and the fragrance houses do not publish figures either.
              </li>
              <li>
                <strong>Performance is discussed, not quantified.</strong> We will tell you
                which notes are volatile and which carry the drydown — citrus and florals
                fade early, resins and woods do not. That is chemistry, and it is enough to
                reason about a fragrance. It is not a substitute for wearing it.
              </li>
              <li>
                <strong>No invented numbers.</strong> No review counts, no star ratings
                gathered from nobody, no search volumes, no figures borrowed from a source
                we have not read on a recorded date. A missing price reads "not listed"
                rather than becoming a zero or a dash.
              </li>
              <li>
                <strong>Editorial and commercial data stay separate.</strong> Prose lives in
                one place and retailer offers in another, so a price changing never
                requires rewriting a sentence, and a sentence changing never moves a price.
              </li>
              <li>
                <strong>We do not vouch for retailers.</strong> We link to them and we say
                so. Authenticity, shipping and returns are the retailer's responsibility and
                their policy is the one that governs a claim. If authenticity matters to you,
                buy direct from the fragrance house.
              </li>
            </ul>

            <h2>How we make money</h2>
            <p>
              Through affiliate links. If you buy something after following one of our
              retailer links we may earn a commission. It costs you nothing extra, it does
              not change the price you pay, and it does not buy a position in a review. That
              relationship is the reason the editorial side is free.
            </p>
          </div>

          <div className="mt-16 border-t border-white/10 pt-8">
            <Link to="/#explore" className="pf-link pf-link--gold text-[0.8rem] tracking-[0.12em] uppercase">
              Explore the selection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
