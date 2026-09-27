import { Link } from "react-router";

export function meta() {
  return [
    { title: "About Us — PhiloFragrancy Editorial Standards & Independent Lab" },
    {
      name: "description",
      content:
        "Learn about PhiloFragrancy, our independent fragrance testing methodology, olfactory breakdown panels, and commitment to authentic perfume savings.",
    },
  ];
}

export default function AboutRoute() {
  return (
    <div className="w-full bg-[#070707] text-[#e5e5e7]">
      <section className="pf-section">
        <div className="pf-container-narrow">
          <p className="pf-eyebrow">The architecture of scent</p>
          <h1 className="pf-h1 mt-5 text-[clamp(2.6rem,6vw,4rem)]">About PhiloFragrancy</h1>

          <div className="pf-prose mt-10">
            <p>
              PhiloFragrancy was founded with a singular conviction: luxury perfumery is an art form deserving of
              rigorous, independent critique and transparent consumer guidance.
            </p>
            <p>
              In an industry frequently clouded by marketing hyperbole and opaque reformulations, we provide exhaustive
              wear-testing, precise olfactory pyramids, and verified discount access to authentic flacons from
              authorized luxury retailers.
            </p>

            <h2>Our editorial standards</h2>
            <ul>
              <li>
                <strong>Lab-tested longevity:</strong> every fragrance is evaluated on neutral cotton blotters and varied
                skin chemistries over a minimum 48-hour testing cycle.
              </li>
              <li>
                <strong>100% authentic batches:</strong> we exclusively track and link to verified distributors
                (FragranceNet, Sephora, Nordstrom, brand boutiques) with guaranteed authenticity warranties.
              </li>
              <li>
                <strong>Unbiased evaluations:</strong> editorial ratings and critiques are completely firewalled from
                affiliate partnerships.
              </li>
            </ul>
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
