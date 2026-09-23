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
    <div className="w-full bg-[#070707] text-[#e5e5e7] py-16">
      <div style={{ maxWidth: "840px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "#d4af37", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          THE ARCHITECTURE OF SCENT
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "3.5rem",
            fontWeight: 400,
            color: "#ffffff",
            marginBottom: "2rem",
            lineHeight: 1.1,
          }}
        >
          About PhiloFragrancy
        </h1>

        <div style={{ fontSize: "1rem", color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.8 }}>
          <p style={{ marginBottom: "1.5rem" }}>
            PhiloFragrancy was founded with a singular conviction: luxury perfumery is an art form deserving of rigorous, independent critique and transparent consumer guidance.
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            In an industry frequently clouded by marketing hyperbole and opaque reformulations, we provide exhaustive wear-testing, precise olfactory pyramids, and verified discount access to authentic flacons from authorized luxury retailers.
          </p>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "2rem",
              color: "#ffffff",
              marginTop: "3rem",
              marginBottom: "1rem",
            }}
          >
            Our Editorial Standards
          </h2>
          <ul style={{ paddingLeft: "1.25rem", marginBottom: "2rem" }}>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: "#ffffff" }}>Lab-Tested Longevity:</strong> Every fragrance is evaluated on both neutral cotton blotters and varied skin chemistries over a minimum 48-hour testing cycle.
            </li>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: "#ffffff" }}>100% Authentic Batches:</strong> We exclusively track and link to verified distributors (FragranceNet, Sephora, Nordstrom, Brand Boutiques) with guaranteed authenticity warranties.
            </li>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: "#ffffff" }}>Unbiased Evaluations:</strong> Editorial ratings and critiques are completely firewalled from affiliate partnerships.
            </li>
          </ul>

          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#d4af37",
                textDecoration: "none",
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
                fontWeight: 600,
              }}
            >
              ← Explore Curated Fragrance Selection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
