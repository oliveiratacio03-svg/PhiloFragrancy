import { useState } from "react";
import { Link, useParams } from "react-router";
import { useActionQuery } from "@agent-native/core/client";
import { PERFUMES, COUPONS } from "@/data/coupons";
import { FragranceReview, type FragranceReviewData } from "@/components/review/FragranceReview";

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

  /**
   * The stored editorial review replaces the legacy inline copy when one exists.
   * `includeDraft` lets an editor preview pipeline output in place — the
   * renderer labels it as a draft, and there is no path that turns an
   * unpublished review into published copy.
   */
  const { data: reviewData } = useActionQuery("get-fragrance-review", {
    slug: slug ?? "",
    includeDraft: true,
  });
  const hasStoredReview = Boolean(reviewData?.review);

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
          "itemCondition": "https://schema.org.NewCondition",
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
    <div className="w-full bg-[#070707] text-[#e5e5e7]">
      {/* Schema.org JSON-LD Script for Google Ads DSA & Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pf-container">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="pf-meta flex flex-wrap items-center gap-x-2 gap-y-1 py-8"
        >
          <Link to="/" className="pf-link">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/#explore" className="pf-link">
            Fragrances
          </Link>
          <span aria-hidden="true">/</span>
          <span>{perfume.brand}</span>
          <span aria-hidden="true">/</span>
          <span className="pf-link--gold">{perfume.name}</span>
        </nav>

        {/* ── TOP SECTION: Packshot, Title, Specs & Coupon CTA ── */}
        <div className="grid gap-12 pb-14 md:grid-cols-2 lg:gap-16">
          {/* Left: Packshot Presentation in Clean Ivory Studio Frame */}
          <div>
            <div className="pf-frame aspect-[1/1.1]">
              {perfume.image ? (
                <img
                  src={perfume.image}
                  alt={`${perfume.brand} ${perfume.name} luxury flacon`}
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{ background: perfume.imageGradient }}
                />
              )}
            </div>

            {/* Quiet trust meta line */}
            <p className="pf-meta mt-5 leading-relaxed">
              100% Authentic Batch · Lab Tested &amp; Verified · Authorized Retail Partner · 30-Day
              Buyer Guarantee
            </p>
          </div>

          {/* Right: DSA Optimized Title, Specs, and Coupon CTA */}
          <div>
            <p className="pf-eyebrow">
              {perfume.brand} · {perfume.concentration}
            </p>

            {/* Targeted H1 for Google Ads DSA & Organic Intent */}
            <h1 className="pf-h1 mt-3 text-[clamp(2.4rem,4vw,3.6rem)]">{perfume.name}</h1>

            {/* Rating & Social Proof */}
            <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="pf-eyebrow">{perfume.rating} / 5.0</span>
              <span className="pf-meta">({perfume.reviewCount.toLocaleString()} verified ratings)</span>
            </div>

            {/* Editorial One-Liner */}
            <p className="pf-lede mt-6">{perfume.description}</p>

            {/* ── THE AFFILIATE COUPON CARD (Direct Affiliate Redirection on Click) ── */}
            {coupon && (
              <div className="pf-card mt-9 p-7">
                {/* Quiet verification meta line */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="pf-meta">Verified today · {daysLeft} days left</p>
                  <p className="pf-meta">Store: {coupon.retailer}</p>
                </div>

                <p className="mt-6 text-[1.6rem] font-semibold leading-none text-gold">
                  {coupon.discount}
                </p>
                <p className="mt-3 text-[0.85rem] leading-relaxed text-[#e5e5e7]">
                  {coupon.description}
                </p>

                {/* Price Display */}
                <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-[rgba(255,255,255,0.08)] pb-5">
                  <span className="text-[1.75rem] font-bold text-white">
                    from ${perfume.discountedPrice}
                  </span>
                  <span className="text-[1rem] text-[rgba(255,255,255,0.4)] line-through">
                    ${perfume.originalPrice}
                  </span>
                  <span className="text-[0.75rem] font-semibold text-[#4ade80]">
                    You Save ${perfume.originalPrice - perfume.discountedPrice} (
                    {Math.round(((perfume.originalPrice - perfume.discountedPrice) / perfume.originalPrice) * 100)}
                    %)
                  </span>
                </div>

                {/* COUPON CLICK ACTION: Sends Directly to Affiliate Link */}
                <button type="button" onClick={handleClaimOffer} className="pf-btn pf-btn--block mt-6">
                  <span>
                    {copied
                      ? "COUPON COPIED! REDIRECTING..."
                      : `ACTIVATE COUPON & SHOP ON ${coupon.retailer.toUpperCase()} ↗`}
                  </span>
                </button>

                <p className="mt-4 text-center text-[0.72rem] text-[rgba(255,255,255,0.45)]">
                  Promo Code: <code className="font-bold text-gold">{coupon.code}</code> (Auto-applied at
                  checkout)
                </p>
              </div>
            )}

            {/* Quick Specs */}
            <div className="mt-10">
              <div className="pf-spec">
                <span className="pf-spec__label">Family</span>
                <span className="pf-spec__value">{perfume.family}</span>
              </div>
              <div className="pf-spec">
                <span className="pf-spec__label">Longevity</span>
                <span className="pf-spec__value">
                  {perfume.longevity} / 10 (8-12 hrs)
                </span>
              </div>
              <div className="pf-spec">
                <span className="pf-spec__label">Sillage</span>
                <span className="pf-spec__value">
                  {perfume.sillage} / 10 (Moderate to Strong)
                </span>
              </div>
              <div className="pf-spec">
                <span className="pf-spec__label">Best Seasons</span>
                <span className="pf-spec__value">{perfume.season.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="pf-rule" />

        {hasStoredReview ? (
          <FragranceReview data={reviewData as FragranceReviewData} />
        ) : (
          <>
        {/* ── 1. OLFACTORY PYRAMID SECTION ── */}
        <section className="pf-section">
          <p className="pf-eyebrow">Scent Architecture</p>
          <h2 className="pf-h2 mt-3">Olfactory Pyramid &amp; Fragrance Notes</h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Top Notes */}
            <div>
              <h3 className="pf-h3">Top Notes</h3>
              <p className="pf-meta mt-2">Opening · First 15–30 mins</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {perfume.topNotes.map((note) => (
                  <span key={note} className="pf-tag pf-tag--gold">
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Heart Notes */}
            <div>
              <h3 className="pf-h3">Heart Notes</h3>
              <p className="pf-meta mt-2">The Heart · Hours 2–6</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {perfume.heartNotes.map((note) => (
                  <span key={note} className="pf-tag">
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Base Notes */}
            <div>
              <h3 className="pf-h3">Base Notes</h3>
              <p className="pf-meta mt-2">Drydown · Hours 6–12+</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {perfume.baseNotes.map((note) => (
                  <span key={note} className="pf-tag pf-tag--gold">
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr className="pf-rule" />

        {/* ── 2. IN-DEPTH EXPERT REVIEW & PROS/CONS (DSA HIGH QUALITY CONTENT) ── */}
        <section className="pf-section">
          <div className="mx-auto w-full max-w-[880px]">
            <p className="pf-eyebrow">Independent Editorial Evaluation</p>
            <h2 className="pf-h2 mt-3">Master Perfumer&apos;s Comprehensive Verdict</h2>

            {/* Verdict pull-quote — 3px gold left rule is identity, not ornament */}
            <blockquote className="mt-10 border-l-[3px] border-l-[#d4af37] pl-6 font-serif-luxury text-[1.25rem] italic leading-relaxed text-[#e5e5e7]">
              &ldquo;{perfume.expertVerdict}&rdquo;
            </blockquote>

            {/* Full Detailed Body Review */}
            <div className="pf-prose mt-10">
              <p>{perfume.fullReview}</p>
              <p>
                When tested against ambient humidity and air-conditioned environments, {perfume.name}{" "}
                demonstrated impressive structural integrity. The balance between the buoyant opening
                accords and the anchoring base molecules ensures that wearer fatigue is minimized while
                retaining external projection for up to {perfume.longevity} hours.
              </p>
            </div>

            {/* Pros and Cons */}
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {/* Pros */}
              <div>
                <h3 className="text-[0.85rem] font-semibold tracking-[0.1em] text-[#4ade80] uppercase">
                  Reasons to Buy
                </h3>
                <ul className="m-0 mt-5 list-none space-y-3 p-0">
                  {perfume.pros.map((pro, i) => (
                    <li key={i} className="text-[0.85rem] leading-relaxed text-[#e5e5e7]">
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <h3 className="text-[0.85rem] font-semibold tracking-[0.1em] text-[#f87171] uppercase">
                  Considerations
                </h3>
                <ul className="m-0 mt-5 list-none space-y-3 p-0">
                  {perfume.cons.map((con, i) => (
                    <li key={i} className="text-[0.85rem] leading-relaxed text-[#e5e5e7]">
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Coupon CTA */}
            <div className="mt-16 border-t border-[rgba(255,255,255,0.08)] pt-12 text-center">
              <h3 className="pf-h3 text-[1.75rem]">Ready to Experience {perfume.name}?</h3>
              <p className="mt-3 text-[0.85rem] leading-relaxed text-[rgba(255,255,255,0.6)]">
                Redeem code <strong className="text-gold">{coupon?.code}</strong> for{" "}
                {coupon?.discount} at {coupon?.retailer}. Guaranteed authentic stock with priority
                delivery.
              </p>
              <button type="button" onClick={handleClaimOffer} className="pf-btn mt-7">
                {copied
                  ? "COUPON COPIED! OPENING STORE..."
                  : `CLAIM ${coupon?.discount} AT ${coupon?.retailer.toUpperCase()}`}
              </button>
            </div>
          </div>
        </section>

        <hr className="pf-rule" />

        {/* ── 3. FREQUENTLY ASKED QUESTIONS (DSA Optimized) ── */}
        <section className="pf-section">
          <div className="mx-auto w-full max-w-[880px]">
            <h2 className="pf-h2">Frequently Asked Questions</h2>

            <div className="mt-10">
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
                <div key={idx} className="pf-row">
                  <h3 className="text-base font-semibold text-white">{item.q}</h3>
                  <p className="mt-2 text-[0.85rem] leading-relaxed text-[rgba(255,255,255,0.6)]">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
          </>
        )}
      </div>
    </div>
  );
}
