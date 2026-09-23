import { useState } from "react";
import { Link } from "react-router";
import { PERFUMES, getCouponByPerfumeId, type Perfume } from "@/data/coupons";

export function meta() {
  return [
    { title: "PhiloFragrancy — Luxury Fragrance Coupons & Expert Reviews" },
    {
      name: "description",
      content:
        "The connoisseur's editorial guide to luxury fragrances. Verified discount codes, in-depth olfactory reviews, and notes breakdowns for Creed, Chanel, Dior, Tom Ford, and Byredo.",
    },
    { name: "og:title", content: "PhiloFragrancy — Luxury Fragrance Guide & Exclusive Deals" },
    {
      name: "og:description",
      content:
        "Find your signature scent with verified fragrance discount codes and master perfumer reviews.",
    },
  ];
}

export default function HomeRoute() {
  const [activeTab, setActiveTab] = useState<"all" | "woody" | "oriental" | "fresh">("all");

  const featuredPerfumes = [
    PERFUMES.find((p) => p.slug === "bleu-de-chanel") || PERFUMES[0],
    PERFUMES.find((p) => p.slug === "creed-aventus") || PERFUMES[1],
    PERFUMES.find((p) => p.slug === "dior-sauvage") || PERFUMES[2],
  ];

  const filteredPerfumes = PERFUMES.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "woody") return p.family.toLowerCase().includes("woody");
    if (activeTab === "oriental") return p.family.toLowerCase().includes("oriental") || p.family.toLowerCase().includes("spicy");
    if (activeTab === "fresh") return p.family.toLowerCase().includes("fruity") || p.family.toLowerCase().includes("aromatic") || p.family.toLowerCase().includes("floral");
    return true;
  });

  return (
    <div className="w-full bg-[#070707] text-[#e5e5e7]">
      {/* ── 1. HERO SECTION (Dark design with Venus & flowers image) ── */}
      <section
        style={{
          position: "relative",
          minHeight: "88vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: "#070707",
          padding: "4rem 1.5rem",
        }}
      >
        {/* Background Artwork: Venus with Flowers */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <img
            src="/images/venus-hero.jpg"
            alt="Venus surrounded by flowers and celestial sphere"
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              opacity: 0.95,
              filter: "contrast(1.05) brightness(0.96)",
            }}
          />
          {/* Radial vignette fade into dark background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at center, transparent 40%, rgba(7, 7, 7, 0.7) 75%, #070707 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "140px",
              background: "linear-gradient(to top, #070707 0%, transparent 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "80px",
              background: "linear-gradient(to bottom, #070707 0%, transparent 100%)",
            }}
          />
        </div>

        {/* Hero Overlay Content (Centered over the celestial sphere) */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            maxWidth: "680px",
            padding: "2rem 1.5rem",
          }}
        >
          {/* PHILO */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(3.2rem, 7vw, 5.5rem)",
              fontWeight: 500,
              letterSpacing: "0.18em",
              color: "#ffffff",
              lineHeight: 0.95,
              textTransform: "uppercase",
              textShadow: "0 4px 24px rgba(0, 0, 0, 0.85)",
              margin: 0,
            }}
          >
            PHILO
          </h1>

          {/* FRAGRANCY (Italic Gold) */}
          <div
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(2.5rem, 5.5vw, 4.2rem)",
              fontWeight: 400,
              color: "#d4af37",
              letterSpacing: "0.04em",
              lineHeight: 1.1,
              marginTop: "-0.2rem",
              textShadow: "0 2px 18px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.35)",
            }}
          >
            FRAGRANCY
          </div>

          {/* Subtitle: Find your signature. */}
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(1.1rem, 2vw, 1.45rem)",
              fontStyle: "italic",
              color: "rgba(255, 255, 255, 0.88)",
              letterSpacing: "0.06em",
              marginTop: "0.75rem",
              marginBottom: "2rem",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.8)",
            }}
          >
            Find your signature.
          </p>

          {/* Gold Action Button: VIEW OFFERS ↗ */}
          <div>
            <a
              href="#selection"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 2rem",
                backgroundColor: "#c6a45c",
                color: "#0b0b0c",
                fontFamily: "'Inter Variable', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderRadius: "2px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5), 0 0 25px rgba(212, 175, 55, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#e0be75";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 6px 25px rgba(0, 0, 0, 0.6), 0 0 35px rgba(212, 175, 55, 0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#c6a45c";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 4px 20px rgba(0, 0, 0, 0.5), 0 0 25px rgba(212, 175, 55, 0.3)";
              }}
            >
              VIEW OFFERS ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. SECTION 01 — SELECTION: Fragrances in focus ── */}
      <section
        id="selection"
        style={{
          padding: "6rem 2rem 5rem 2rem",
          maxWidth: "1320px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Left Column: Heading & Subtitle */}
          <div style={{ maxWidth: "340px" }}>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                fontWeight: 600,
                color: "#997b3d",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
              }}
            >
              01 — SELECTION
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2.4rem, 4vw, 3.5rem)",
                lineHeight: 1.05,
                fontWeight: 400,
                color: "#ffffff",
                margin: 0,
              }}
            >
              Fragrances
              <br />
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  color: "#d4af37",
                }}
              >
                in focus.
              </span>
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: "rgba(255, 255, 255, 0.55)",
                lineHeight: 1.6,
                marginTop: "1.5rem",
              }}
            >
              Selections that deserve to be experienced. Each scent is analyzed by master noses and paired with verified retailer savings.
            </p>
          </div>

          {/* Right Column: 3 Perfume Packshot Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.75rem",
            }}
          >
            {featuredPerfumes.map((perfume) => {
              const coupon = getCouponByPerfumeId(perfume.id);
              return (
                <Link
                  key={perfume.id}
                  to={`/perfumes/${perfume.slug}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    group: "card",
                  }}
                  className="card-hover-luxury"
                >
                  {/* Clean White/Ivory Card Container for Bottle Packshot */}
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "2px",
                      overflow: "hidden",
                      aspectRatio: "1 / 1.15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "1.5rem",
                      position: "relative",
                      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.35)",
                    }}
                  >
                    {perfume.image ? (
                      <img
                        src={perfume.image}
                        alt={`${perfume.brand} ${perfume.name}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          transition: "transform 0.4s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
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

                    {/* Subtle Deal Tag in Corner */}
                    {coupon && (
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          backgroundColor: "#070707",
                          color: "#d4af37",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "2px",
                        }}
                      >
                        {coupon.discount}
                      </div>
                    )}
                  </div>

                  {/* Card Meta Details Below */}
                  <div style={{ marginTop: "1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: "1.35rem",
                          fontWeight: 500,
                          color: "#ffffff",
                          margin: 0,
                        }}
                      >
                        {perfume.name}
                      </h3>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          letterSpacing: "0.12em",
                          color: "#d4af37",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                      >
                        VIEW DEAL ↗
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: "0.72rem",
                        letterSpacing: "0.1em",
                        color: "rgba(255, 255, 255, 0.45)",
                        textTransform: "uppercase",
                        marginTop: "0.25rem",
                      }}
                    >
                      {perfume.brand} · {perfume.concentration}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. CONTRAST BANNER: "The art of wearing well." (Ivory / Warm Cream) ── */}
      <section
        style={{
          backgroundColor: "#F5F2EB",
          color: "#18181b",
          padding: "5.5rem 2rem",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Subtle Top Divider Dot */}
          <div
            style={{
              width: "4px",
              height: "4px",
              backgroundColor: "#b8860b",
              borderRadius: "50%",
              margin: "0 auto 1.5rem auto",
            }}
          />

          <div
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.22em",
              fontWeight: 600,
              color: "#a46338",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            A QUICKER WAY TO CHOOSE SCENT
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.6rem, 5vw, 4.2rem)",
              lineHeight: 1.08,
              fontWeight: 400,
              color: "#111113",
              margin: 0,
            }}
          >
            The art of{" "}
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                color: "#b05934",
              }}
            >
              wearing well.
            </span>
          </h2>

          <p
            style={{
              fontSize: "0.95rem",
              color: "#52525b",
              lineHeight: 1.7,
              marginTop: "1.25rem",
              maxWidth: "520px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Independent insight for a more intentional collection. We pair deep scent analysis with verified coupon codes so you can invest wisely in luxury fragrances.
          </p>
        </div>
      </section>

      {/* ── 4. SECTION 02 — DISCOVER: "Begin here." ── */}
      <section
        id="discover"
        style={{
          padding: "6rem 2rem",
          maxWidth: "1320px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "3.5rem",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                fontWeight: 600,
                color: "#997b3d",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              02 — DISCOVER
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2.6rem, 4.5vw, 3.8rem)",
                fontWeight: 400,
                color: "#ffffff",
                margin: 0,
              }}
            >
              Begin here.
            </h2>
          </div>
          <p
            style={{
              fontSize: "0.85rem",
              color: "rgba(255, 255, 255, 0.45)",
              maxWidth: "360px",
              margin: 0,
            }}
          >
            Navigate our fragrance database by curated savings, detailed olfactory pyramids, or direct side-by-side performance tests.
          </p>
        </div>

        {/* 3 Columns: 01, 02, 03 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2.5rem",
            paddingBottom: "3rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Column 01: Exclusive Coupons */}
          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              paddingTop: "1.75rem",
            }}
          >
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
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.5rem",
                  color: "#d4af37",
                }}
              >
                01
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <div
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.18em",
                color: "rgba(255, 255, 255, 0.4)",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              SAVE BEAUTIFULLY
            </div>
            <a
              href="#catalog"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.65rem",
                color: "#ffffff",
                textDecoration: "none",
                display: "block",
                marginBottom: "0.75rem",
                lineHeight: 1.2,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#d4af37";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
              }}
            >
              Exclusive Coupons ↗
            </a>
            <p style={{ fontSize: "0.8125rem", color: "rgba(255, 255, 255, 0.5)", lineHeight: 1.6 }}>
              Direct savings codes for Creed, Dior, Tom Ford, and niche fragrance houses. Verified daily.
            </p>
          </div>

          {/* Column 02: Detailed Reviews */}
          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              paddingTop: "1.75rem",
            }}
          >
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
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.5rem",
                  color: "#d4af37",
                }}
              >
                02
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <div
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.18em",
                color: "rgba(255, 255, 255, 0.4)",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              KNOW THE NOTES
            </div>
            <a
              href="#reviews"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.65rem",
                color: "#ffffff",
                textDecoration: "none",
                display: "block",
                marginBottom: "0.75rem",
                lineHeight: 1.2,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#d4af37";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
              }}
            >
              Detailed Reviews ↗
            </a>
            <p style={{ fontSize: "0.8125rem", color: "rgba(255, 255, 255, 0.5)", lineHeight: 1.6 }}>
              Unbiased olfactory evaluations, projection distances, sillage trails, and wear-test ratings.
            </p>
          </div>

          {/* Column 03: Smart Comparisons */}
          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              paddingTop: "1.75rem",
            }}
          >
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
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.5rem",
                  color: "#d4af37",
                }}
              >
                03
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <div
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.18em",
                color: "rgba(255, 255, 255, 0.4)",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              CHOOSE WITH CLARITY
            </div>
            <a
              href="#catalog"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.65rem",
                color: "#ffffff",
                textDecoration: "none",
                display: "block",
                marginBottom: "0.75rem",
                lineHeight: 1.2,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#d4af37";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
              }}
            >
              Smart Comparisons ↗
            </a>
            <p style={{ fontSize: "0.8125rem", color: "rgba(255, 255, 255, 0.5)", lineHeight: 1.6 }}>
              EDP vs Parfum formulas compared, season compatibility charts, and alternative recommendations.
            </p>
          </div>
        </div>

        {/* Minimal Editorial Rows */}
        <div style={{ marginTop: "2.5rem" }}>
          {[
            { title: "Coupons", meta: "SELECTED OFFERS / 24", anchor: "#catalog" },
            { title: "Reviews", meta: "NOTES, TRAILS, IMPRESSIONS / 50", anchor: "#reviews" },
            { title: "Comparisons", meta: "FIND YOUR ACCORD / 16", anchor: "#catalog" },
          ].map((row, idx) => (
            <a
              key={idx}
              href={row.anchor}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.5rem 0",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                textDecoration: "none",
                color: "inherit",
                transition: "padding-left 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "8px";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "0px";
              }}
            >
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.35rem",
                  color: "#ffffff",
                }}
              >
                {row.title}
              </span>
              <span
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.16em",
                  color: "rgba(255, 255, 255, 0.45)",
                }}
              >
                {row.meta}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── 5. FULL CATALOG & INDIVIDUAL PRODUCT HUBS (Google Ads DSA Compliant) ── */}
      <section
        id="catalog"
        style={{
          padding: "5rem 2rem 7rem 2rem",
          maxWidth: "1320px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.5rem",
            marginBottom: "3rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            paddingBottom: "1.5rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: "#d4af37",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              ALL TESTED FRAGRANCES
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "2.25rem",
                fontWeight: 400,
                color: "#ffffff",
                margin: 0,
              }}
            >
              Curated Fragrance Reviews & Exclusive Codes
            </h2>
          </div>

          {/* Filter Pills */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {[
              { id: "all", label: "All Fragrances" },
              { id: "woody", label: "Woody & Amber" },
              { id: "oriental", label: "Warm & Spicy" },
              { id: "fresh", label: "Fresh & Floral" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: "0.45rem 1rem",
                  fontSize: "0.75rem",
                  letterSpacing: "0.06em",
                  borderRadius: "2px",
                  border:
                    activeTab === tab.id
                      ? "1px solid #d4af37"
                      : "1px solid rgba(255, 255, 255, 0.12)",
                  backgroundColor:
                    activeTab === tab.id ? "rgba(212, 175, 55, 0.12)" : "transparent",
                  color: activeTab === tab.id ? "#d4af37" : "rgba(255, 255, 255, 0.6)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Perfume Grid: Click opens Dedicated Review & Coupon Page */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: "2.25rem",
          }}
        >
          {filteredPerfumes.map((perfume) => {
            const coupon = getCouponByPerfumeId(perfume.id);
            return (
              <Link
                key={perfume.id}
                to={`/perfumes/${perfume.slug}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#0d0d0e",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "inherit",
                }}
                className="card-hover-luxury"
              >
                {/* Image Block */}
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    aspectRatio: "1 / 1.05",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1.5rem",
                    position: "relative",
                  }}
                >
                  {perfume.image ? (
                    <img
                      src={perfume.image}
                      alt={`${perfume.brand} ${perfume.name}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: perfume.imageGradient,
                        borderRadius: "2px",
                      }}
                    />
                  )}

                  {coupon && (
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        backgroundColor: "#c6a45c",
                        color: "#070707",
                        fontWeight: 700,
                        fontSize: "0.68rem",
                        letterSpacing: "0.06em",
                        padding: "0.25rem 0.65rem",
                        borderRadius: "2px",
                      }}
                    >
                      {coupon.discount}
                    </div>
                  )}

                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "12px",
                      backgroundColor: "rgba(7, 7, 7, 0.8)",
                      color: "#ffffff",
                      fontSize: "0.65rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "2px",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    ★ {perfume.rating} ({perfume.reviewCount.toLocaleString()})
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      letterSpacing: "0.14em",
                      color: "#997b3d",
                      textTransform: "uppercase",
                      marginBottom: "0.35rem",
                    }}
                  >
                    {perfume.brand}
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "1.45rem",
                      fontWeight: 500,
                      color: "#ffffff",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    {perfume.name}
                  </h3>

                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "rgba(255, 255, 255, 0.5)",
                      lineHeight: 1.5,
                      marginBottom: "1rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {perfume.description}
                  </p>

                  {/* Notes Preview */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.35rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    {perfume.topNotes.slice(0, 3).map((note) => (
                      <span
                        key={note}
                        style={{
                          fontSize: "0.68rem",
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          color: "rgba(255, 255, 255, 0.7)",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "2px",
                        }}
                      >
                        {note}
                      </span>
                    ))}
                  </div>

                  {/* Price & Action Link (No exposed raw code) */}
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "1rem",
                      borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.4)" }}>
                        From
                      </div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#d4af37" }}>
                        ${perfume.discountedPrice}{" "}
                        <span
                          style={{
                            fontSize: "0.75rem",
                            textDecoration: "line-through",
                            color: "rgba(255, 255, 255, 0.35)",
                            fontWeight: 400,
                          }}
                        >
                          ${perfume.originalPrice}
                        </span>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: "0.75rem",
                        letterSpacing: "0.08em",
                        fontWeight: 600,
                        color: "#070707",
                        backgroundColor: "#c6a45c",
                        padding: "0.45rem 0.9rem",
                        borderRadius: "2px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      View Review & Deal ↗
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 6. EDITORIAL METHODOLOGY & GOOGLE ADS DSA TRUST SIGNALS ── */}
      <section
        id="reviews"
        style={{
          backgroundColor: "#050505",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "5rem 2rem",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
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
              INDEPENDENT TESTING PROCESS
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "2.5rem",
                fontWeight: 400,
                color: "#ffffff",
                margin: 0,
              }}
            >
              How PhiloFragrancy Evaluates Scents
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                step: "01",
                title: "Blind Lab Wear-Testing",
                desc: "Every perfume undergoes 48-hour testing on both human skin and neutral blotters to measure true longevity and scent evolution.",
              },
              {
                step: "02",
                title: "Olfactory Pyramids",
                desc: "We deconstruct top, heart, and base notes with chemical analysis and nosing panels to confirm authenticity and depth.",
              },
              {
                step: "03",
                title: "Coupon Verification",
                desc: "Our discount codes are tested daily with authorized retailers (FragranceNet, Sephora, Nordstrom) ensuring 100% active checkout status.",
              },
              {
                step: "04",
                title: "Affiliate Transparency",
                desc: "Editorial ratings remain 100% independent. We only recommend genuine batch formulations from vetted distributors.",
              },
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  borderLeft: "1px solid #d4af37",
                  paddingLeft: "1.25rem",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "1.25rem",
                    color: "#d4af37",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.step}
                </div>
                <h4
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#ffffff",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.title}
                </h4>
                <p style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.55)", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
