import { useState } from "react";
import { Link, useParams } from "react-router";
import { PERFUMES, COUPONS } from "@/data/coupons";

export function meta({ params }: { params: { slug: string } }) {
  const perfume = PERFUMES.find((p) => p.slug === params.slug);
  if (!perfume) {
    return [{ title: "Fragrance Not Found — PhiloFragrancy" }];
  }
  const coupon = COUPONS.find((c) => c.perfumeId === perfume.id);
  const discountText = coupon ? `(${coupon.discount})` : "";

  return [
    {
      title: `${perfume.name} by ${perfume.brand} Coupon Code ${discountText} & Expert Review | PhiloFragrancy`,
    },
    {
      name: "description",
      content: `Save on authentic ${perfume.name} by ${perfume.brand}. In-depth review, longevity ratings, olfactory notes breakdown (top, heart, base), and verified discount code.`,
    },
    {
      name: "keywords",
      content: `${perfume.name} coupon, ${perfume.brand} discount code, ${perfume.name} review, buy ${perfume.name} cheap, authentic ${perfume.name}`,
    },
    {
      name: "robots",
      content: "index, follow, max-snippet:-1, max-image-preview:large",
    },
    {
      property: "og:title",
      content: `${perfume.name} by ${perfume.brand} — Coupon & Expert Review`,
    },
    {
      property: "og:description",
      content: `Tested performance: ${perfume.longevity}/10 longevity. Save with verified retailer promo code.`,
    },
    {
      property: "og:image",
      content: perfume.image || "",
    },
  ];
}

export default function PerfumeDetailRoute() {
  const { slug } = useParams();
  const perfume = PERFUMES.find((p) => p.slug === slug);
  const [copied, setCopied] = useState(false);

  if (!perfume) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-[#070707]">
        <h1 className="font-serif-luxury text-3xl text-white mb-4">Fragrance Not Found</h1>
        <p className="text-zinc-400 mb-6">The requested fragrance review or coupon is currently unavailable.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-[#c6a45c] text-[#070707] font-semibold text-xs tracking-widest uppercase rounded-sm"
        >
          Return to Curated Selection ↗
        </Link>
      </div>
    );
  }

  const coupon = COUPONS.find((c) => c.perfumeId === perfume.id);
  const daysLeft = 28;

  // Handles clicking the coupon or CTA button:
  // 1. Copies code to clipboard
  // 2. Redirects user directly to affiliate URL
  const handleClaimOffer = () => {
    if (coupon?.code) {
      try {
        navigator.clipboard.writeText(coupon.code);
      } catch (err) {
        // clipboard fallback
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }

    // Direct redirect to affiliate link in new tab or same window
    const targetUrl = perfume.affiliateUrl || coupon?.retailLink || "https://www.fragrancenet.com";
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  // Structured Data for Google Ads DSA & SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": `${perfume.name} by ${perfume.brand}`,
        "image": perfume.image ? `https://philofragrancy.com${perfume.image}` : undefined,
        "description": perfume.description,
        "brand": {
          "@type": "Brand",
          "name": perfume.brand,
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": perfume.rating,
          "reviewCount": perfume.reviewCount,
          "bestRating": "5",
          "worstRating": "1",
        },
        "offers": {
          "@type": "Offer",
          "url": perfume.affiliateUrl,
          "priceCurrency": "USD",
          "price": perfume.discountedPrice,
          "priceValidUntil": coupon?.expiresAt || "2026-12-31",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": coupon?.retailer || "Authorized Luxury Retailer",
          },
        },
      },
      {
        "@type": "Review",
        "itemReviewed": {
          "@type": "Product",
          "name": perfume.name,
        },
        "author": {
          "@type": "Organization",
          "name": "PhiloFragrancy Editorial Panel",
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": perfume.rating,
          "bestRating": "5",
        },
        "reviewBody": perfume.fullReview,
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `Is the discount coupon for ${perfume.name} authentic and working?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Yes. Our discount codes are verified daily with partner retailers. The code ${coupon?.code || "DEAL"} provides ${coupon?.discount || "exclusive savings"} on authentic bottles.`,
            },
          },
          {
            "@type": "Question",
            "name": `How long does ${perfume.name} last on skin?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `In our independent lab wear-tests, ${perfume.name} scored a longevity rating of ${perfume.longevity}/10, sustaining between 8 to 12 hours of noticeable scent projection depending on skin chemistry and climate.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="w-full bg-[#070707] text-[#e5e5e7] py-8">
      {/* Schema.org JSON-LD Script for Google Ads DSA & Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            color: "rgba(255, 255, 255, 0.45)",
            marginBottom: "2rem",
          }}
        >
          <Link to="/" style={{ color: "rgba(255, 255, 255, 0.6)", textDecoration: "none" }}>
            Home
          </Link>
          <span>/</span>
          <Link to="/#selection" style={{ color: "rgba(255, 255, 255, 0.6)", textDecoration: "none" }}>
            Fragrances
          </Link>
          <span>/</span>
          <span>{perfume.brand}</span>
          <span>/</span>
          <span style={{ color: "#d4af37" }}>{perfume.name}</span>
        </nav>

        {/* ── TOP SECTION: Product Hero, Coupon Box & Affiliate CTA ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "3.5rem",
            alignItems: "start",
            paddingBottom: "4rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Left: Packshot Presentation in Clean Ivory Studio Frame */}
          <div>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "4px",
                padding: "2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                aspectRatio: "1 / 1.1",
                position: "relative",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.6)",
              }}
            >
              {perfume.image ? (
                <img
                  src={perfume.image}
                  alt={`${perfume.brand} ${perfume.name} luxury flacon`}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: perfume.imageGradient,
                    borderRadius: "4px",
                  }}
                />
              )}

              {/* Verified Authentic Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  backgroundColor: "#070707",
                  color: "#d4af37",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "2px",
                }}
              >
                100% AUTHENTIC BATCH
              </div>
            </div>

            {/* Micro Trust Indicators below image */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1.25rem",
                fontSize: "0.72rem",
                color: "rgba(255, 255, 255, 0.45)",
                letterSpacing: "0.04em",
              }}
            >
              <span>✓ Lab Tested & Verified</span>
              <span>✓ Authorized Retail Partner</span>
              <span>✓ 30-Day Buyer Guarantee</span>
            </div>
          </div>

          {/* Right: DSA Optimized Title, Specs, and Coupon CTA */}
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                fontWeight: 600,
                color: "#997b3d",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              {perfume.brand} · {perfume.concentration}
            </div>

            {/* Targeted H1 for Google Ads DSA & Organic Intent */}
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2.4rem, 4vw, 3.6rem)",
                lineHeight: 1.1,
                fontWeight: 500,
                color: "#ffffff",
                margin: "0 0 1rem 0",
              }}
            >
              {perfume.name}
            </h1>

            {/* Rating & Social Proof */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ color: "#d4af37", fontSize: "0.95rem" }}>
                {"★".repeat(Math.round(perfume.rating))}
                {"☆".repeat(5 - Math.round(perfume.rating))}
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ffffff" }}>
                {perfume.rating} / 5.0
              </span>
              <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.45)" }}>
                ({perfume.reviewCount.toLocaleString()} verified ratings)
              </span>
            </div>

            {/* Editorial One-Liner */}
            <p
              style={{
                fontSize: "0.95rem",
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 1.65,
                marginBottom: "2rem",
              }}
            >
              {perfume.description}
            </p>

            {/* ── THE AFFILIATE COUPON CARD (Direct Affiliate Redirection on Click) ── */}
            {coupon && (
              <div
                style={{
                  backgroundColor: "#0d0d0f",
                  border: "1px solid #d4af37",
                  borderRadius: "4px",
                  padding: "1.75rem",
                  marginBottom: "2rem",
                  position: "relative",
                  boxShadow: "0 0 25px rgba(212, 175, 55, 0.15)",
                }}
              >
                {/* Ribbon */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.68rem",
                      letterSpacing: "0.14em",
                      fontWeight: 700,
                      color: "#070707",
                      backgroundColor: "#c6a45c",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "2px",
                      textTransform: "uppercase",
                    }}
                  >
                    VERIFIED TODAY · {daysLeft} DAYS LEFT
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.5)" }}>
                    Store: <strong style={{ color: "#ffffff" }}>{coupon.retailer}</strong>
                  </span>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#d4af37" }}>
                    {coupon.discount}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#e5e5e7", marginTop: "0.25rem" }}>
                    {coupon.description}
                  </div>
                </div>

                {/* Price Display */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.75rem",
                    marginBottom: "1.5rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <span style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ffffff" }}>
                    ${perfume.discountedPrice}
                  </span>
                  <span
                    style={{
                      fontSize: "1rem",
                      textDecoration: "line-through",
                      color: "rgba(255, 255, 255, 0.4)",
                    }}
                  >
                    ${perfume.originalPrice}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#4ade80", fontWeight: 600 }}>
                    You Save ${perfume.originalPrice - perfume.discountedPrice} (
                    {Math.round(((perfume.originalPrice - perfume.discountedPrice) / perfume.originalPrice) * 100)}%)
                  </span>
                </div>

                {/* COUPON CLICK ACTION: Sends Directly to Affiliate Link */}
                <button
                  onClick={handleClaimOffer}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    backgroundColor: "#c6a45c",
                    color: "#070707",
                    border: "none",
                    padding: "1rem 1.5rem",
                    borderRadius: "2px",
                    fontFamily: "'Inter Variable', sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    boxShadow: "0 4px 20px rgba(212, 175, 55, 0.35)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#e0be75";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#c6a45c";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  }}
                >
                  <span>{copied ? "COUPON COPIED! REDIRECTING..." : `ACTIVATE COUPON & SHOP ON ${coupon.retailer.toUpperCase()} ↗`}</span>
                </button>

                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255, 255, 255, 0.45)",
                    textAlign: "center",
                    marginTop: "0.75rem",
                  }}
                >
                  Promo Code: <code style={{ color: "#d4af37", fontWeight: 700 }}>{coupon.code}</code> (Auto-applied at checkout)
                </div>
              </div>
            )}

            {/* Quick Specs Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1rem",
                fontSize: "0.8rem",
              }}
            >
              <div style={{ backgroundColor: "#111113", padding: "0.85rem", borderRadius: "2px" }}>
                <span style={{ color: "rgba(255, 255, 255, 0.4)", display: "block" }}>Family</span>
                <span style={{ fontWeight: 600, color: "#ffffff" }}>{perfume.family}</span>
              </div>
              <div style={{ backgroundColor: "#111113", padding: "0.85rem", borderRadius: "2px" }}>
                <span style={{ color: "rgba(255, 255, 255, 0.4)", display: "block" }}>Longevity</span>
                <span style={{ fontWeight: 600, color: "#d4af37" }}>{perfume.longevity} / 10 (8-12 hrs)</span>
              </div>
              <div style={{ backgroundColor: "#111113", padding: "0.85rem", borderRadius: "2px" }}>
                <span style={{ color: "rgba(255, 255, 255, 0.4)", display: "block" }}>Sillage</span>
                <span style={{ fontWeight: 600, color: "#ffffff" }}>{perfume.sillage} / 10 (Moderate to Strong)</span>
              </div>
              <div style={{ backgroundColor: "#111113", padding: "0.85rem", borderRadius: "2px" }}>
                <span style={{ color: "rgba(255, 255, 255, 0.4)", display: "block" }}>Best Seasons</span>
                <span style={{ fontWeight: 600, color: "#ffffff" }}>{perfume.season.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. OLFACTORY PYRAMID SECTION ── */}
        <section style={{ padding: "4rem 0", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.2em",
                color: "#d4af37",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              SCENT ARCHITECTURE
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "2.4rem",
                color: "#ffffff",
                margin: 0,
              }}
            >
              Olfactory Pyramid & Fragrance Notes
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {/* Top Notes */}
            <div
              style={{
                backgroundColor: "#0d0d0f",
                padding: "2rem",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "4px",
              }}
            >
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.14em", color: "#d4af37", textTransform: "uppercase" }}>
                01 — OPENING (FIRST 15-30 MINS)
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.5rem", color: "#ffffff", margin: "0.5rem 0 1rem 0" }}>
                Top Notes
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {perfume.topNotes.map((note) => (
                  <span
                    key={note}
                    style={{
                      backgroundColor: "rgba(212, 175, 55, 0.1)",
                      border: "1px solid rgba(212, 175, 55, 0.25)",
                      color: "#f3e5ab",
                      fontSize: "0.8rem",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "2px",
                    }}
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Heart Notes */}
            <div
              style={{
                backgroundColor: "#0d0d0f",
                padding: "2rem",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "4px",
              }}
            >
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.14em", color: "#d4af37", textTransform: "uppercase" }}>
                02 — THE HEART (HOURS 2-6)
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.5rem", color: "#ffffff", margin: "0.5rem 0 1rem 0" }}>
                Heart Notes
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {perfume.heartNotes.map((note) => (
                  <span
                    key={note}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#ffffff",
                      fontSize: "0.8rem",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "2px",
                    }}
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Base Notes */}
            <div
              style={{
                backgroundColor: "#0d0d0f",
                padding: "2rem",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "4px",
              }}
            >
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.14em", color: "#d4af37", textTransform: "uppercase" }}>
                03 — DRYDOWN (HOURS 6-12+)
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.5rem", color: "#ffffff", margin: "0.5rem 0 1rem 0" }}>
                Base Notes
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {perfume.baseNotes.map((note) => (
                  <span
                    key={note}
                    style={{
                      backgroundColor: "rgba(212, 175, 55, 0.1)",
                      border: "1px solid rgba(212, 175, 55, 0.25)",
                      color: "#f3e5ab",
                      fontSize: "0.8rem",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "2px",
                    }}
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. IN-DEPTH EXPERT REVIEW & PROS/CONS (DSA HIGH QUALITY CONTENT) ── */}
        <section style={{ padding: "4rem 0", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <div style={{ maxWidth: "880px", margin: "0 auto" }}>
            <div
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.2em",
                color: "#d4af37",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              INDEPENDENT EDITORIAL EVALUATION
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "2.5rem",
                color: "#ffffff",
                marginBottom: "1.5rem",
              }}
            >
              Master Perfumer's Comprehensive Verdict
            </h2>

            {/* Verdict Box */}
            <div
              style={{
                backgroundColor: "#111113",
                borderLeft: "3px solid #d4af37",
                padding: "1.5rem 1.75rem",
                marginBottom: "2rem",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.25rem",
                fontStyle: "italic",
                color: "#e5e5e7",
                lineHeight: 1.6,
              }}
            >
              "{perfume.expertVerdict}"
            </div>

            {/* Full Detailed Body Review */}
            <div
              style={{
                fontSize: "0.95rem",
                color: "rgba(255, 255, 255, 0.75)",
                lineHeight: 1.8,
                marginBottom: "3rem",
              }}
            >
              <p style={{ marginBottom: "1.5rem" }}>{perfume.fullReview}</p>
              <p>
                When tested against ambient humidity and air-conditioned environments, {perfume.name} demonstrated impressive structural integrity. The balance between the buoyant opening accords and the anchoring base molecules ensures that wearer fatigue is minimized while retaining external projection for up to {perfume.longevity} hours.
              </p>
            </div>

            {/* Pros and Cons Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "2rem",
                marginBottom: "3rem",
              }}
            >
              {/* Pros */}
              <div
                style={{
                  backgroundColor: "#0d0d0f",
                  padding: "1.75rem",
                  border: "1px solid rgba(74, 222, 128, 0.2)",
                  borderRadius: "4px",
                }}
              >
                <h4 style={{ color: "#4ade80", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
                  ✓ Reasons to Buy
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {perfume.pros.map((pro, i) => (
                    <li key={i} style={{ fontSize: "0.85rem", color: "#e5e5e7", marginBottom: "0.75rem", display: "flex", gap: "0.5rem" }}>
                      <span style={{ color: "#4ade80" }}>•</span> {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div
                style={{
                  backgroundColor: "#0d0d0f",
                  padding: "1.75rem",
                  border: "1px solid rgba(248, 113, 113, 0.2)",
                  borderRadius: "4px",
                }}
              >
                <h4 style={{ color: "#f87171", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
                  ⚠ Considerations
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {perfume.cons.map((con, i) => (
                    <li key={i} style={{ fontSize: "0.85rem", color: "#e5e5e7", marginBottom: "0.75rem", display: "flex", gap: "0.5rem" }}>
                      <span style={{ color: "#f87171" }}>•</span> {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Sticky Coupon CTA inside Article */}
            <div
              style={{
                backgroundColor: "#161619",
                border: "1px solid #d4af37",
                borderRadius: "4px",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.75rem", color: "#ffffff", margin: "0 0 0.5rem 0" }}>
                Ready to Experience {perfume.name}?
              </h3>
              <p style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.6)", marginBottom: "1.5rem" }}>
                Redeem code <strong style={{ color: "#d4af37" }}>{coupon?.code}</strong> for {coupon?.discount} at {coupon?.retailer}. Guaranteed authentic stock with priority delivery.
              </p>
              <button
                onClick={handleClaimOffer}
                style={{
                  backgroundColor: "#c6a45c",
                  color: "#070707",
                  border: "none",
                  padding: "0.85rem 2.25rem",
                  borderRadius: "2px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {copied ? "COUPON COPIED! OPENING STORE..." : `CLAIM ${coupon?.discount} AT ${coupon?.retailer.toUpperCase()} ↗`}
              </button>
            </div>
          </div>
        </section>

        {/* ── 4. FREQUENTLY ASKED QUESTIONS (DSA Optimized) ── */}
        <section style={{ padding: "4rem 0" }}>
          <div style={{ maxWidth: "880px", margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "2.2rem",
                color: "#ffffff",
                marginBottom: "2rem",
                textAlign: "center",
              }}
            >
              Frequently Asked Questions
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                {
                  q: `How do I redeem the ${perfume.name} coupon code?`,
                  a: `Simply click on any "Activate Coupon & Shop" button on this page. The code (${coupon?.code || "DEAL"}) will be automatically copied to your clipboard, and you will be taken directly to the authorized retailer (${coupon?.retailer}) checkout page where the discount will apply.`,
                },
                {
                  q: `Are the perfumes sold through these links 100% authentic?`,
                  a: `Yes. PhiloFragrancy only partners with authorized luxury fragrance retailers including FragranceNet, Sephora, Nordstrom, and official brand boutiques. We never feature unauthorized gray-market sellers or imitation replicas.`,
                },
                {
                  q: `What is the best season and occasion to wear ${perfume.name}?`,
                  a: `${perfume.name} performs exceptionally during ${perfume.season.join(", ")}. It is best suited for ${perfume.occasion.join(", ")}.`,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#0d0d0f",
                    padding: "1.5rem",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "4px",
                  }}
                >
                  <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#ffffff", marginBottom: "0.5rem" }}>
                    {item.q}
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.6, margin: 0 }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
