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
    <div className="w-full bg-[#070707] text-[#e5e5e7] py-16">
      <div style={{ maxWidth: "840px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "#d4af37", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          TRANSPARENCY & INTEGRITY
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
          Affiliate & Commercial Disclosure
        </h1>

        <div style={{ fontSize: "1rem", color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.8 }}>
          <p style={{ marginBottom: "1.5rem" }}>
            In accordance with Federal Trade Commission (FTC) guidelines and Google Advertising Transparency policies, PhiloFragrancy operates with full commercial disclosure across all published content.
          </p>

          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.75rem", color: "#ffffff", marginTop: "2rem", marginBottom: "1rem" }}>
            1. Affiliate Relationships
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            PhiloFragrancy is reader-supported. Some of the links featured on our website (including coupon code buttons, deal links, and product packshot banners) are affiliate links. When you click these links and make a purchase on a partner merchant's website, PhiloFragrancy may earn a referral commission at no additional cost to you.
          </p>

          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.75rem", color: "#ffffff", marginTop: "2rem", marginBottom: "1rem" }}>
            2. Editorial Independence
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            Our editorial ratings, fragrance scores, longevity wear-test metrics, and fragrance reviews are 100% independent. Retailers, manufacturers, and perfume brands do not pay for positive evaluations. If a fragrance performs poorly in our testing or suffers from high dilution, we state so unequivocally in our review.
          </p>

          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.75rem", color: "#ffffff", marginTop: "2rem", marginBottom: "1rem" }}>
            3. Pricing & Coupon Accuracy
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            While our team verifies promotional codes and pricing daily with authorized distributors, prices and stock availability fluctuate rapidly. We recommend confirming final discount totals at the merchant's checkout before completing your transaction.
          </p>

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
              ← Return to PhiloFragrancy Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
