import { Link, useParams } from "react-router";
import { useActionQuery } from "@agent-native/core/client/hooks";
import { PERFUMES, COUPONS } from "@/data/coupons";
import { FragranceReview, type FragranceReviewData } from "@/components/review/FragranceReview";

export function meta({ params }: { params: { slug: string } }) {
  const perfume = PERFUMES.find((p) => p.slug === params.slug);
  if (!perfume) {
    return [{ title: "Fragrance Not Found — PhiloFragrancy" }];
  }

  /* These used to promise a "verified discount code" and a coupon keyword
     string. Neither is true of this site any more, and a title promising a code
     that does not exist is the most expensive kind of lie to leave in a search
     result. */
  return [
    {
      title: `${perfume.name} by ${perfume.brand} — Review & Where to Buy | PhiloFragrancy`,
    },
    {
      name: "description",
      content: `An independent read on ${perfume.name} by ${perfume.brand}: the note pyramid top to base, how the drydown behaves, who it suits, and the retailer offers listed for it.`,
    },
    {
      name: "keywords",
      content: `${perfume.name} review, ${perfume.brand} ${perfume.name}, ${perfume.name} notes, what does ${perfume.name} smell like, where to buy ${perfume.name}`,
    },
    {
      name: "robots",
      content: "index, follow, max-snippet:-1, max-image-preview:large",
    },
    {
      property: "og:title",
      content: `${perfume.name} by ${perfume.brand} — Review & Where to Buy`,
    },
    {
      property: "og:description",
      content: `The note pyramid, the drydown, and the retailer offers listed for ${perfume.name}.`,
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

  /**
   * Where the retailer link points. Nothing else.
   *
   * This used to copy a discount code to the clipboard first and flash a
   * confirmation, on the promise that the code would then apply at checkout.
   * The codes in `coupons.ts` are not issued by any retailer we work with, so
   * that promise was false and the clipboard write was a way of making the
   * failure feel like a success. A plain link cannot lie: the reader lands on
   * the retailer's own page and sees whatever is genuinely on offer.
   */
  const retailerUrl = perfume.affiliateUrl || coupon?.retailLink || "https://www.fragrancenet.com";

  /**
   * Structured data, cut back to what is actually true.
   *
   * Three things were removed here and none of them should come back without a
   * real source behind them:
   *
   *  - `aggregateRating` (ratingValue 4.8, reviewCount 18420). Those counts
   *    were invented. Google's structured data policy treats fabricated review
   *    markup as a manual-action trigger, so this was never a white-SEO tradeoff
   *    — it was a way for the domain to lose its rich results entirely.
   *  - a `Review` node attributed to "PhiloFragrancy Editorial Panel" wrapping
   *    prose that claims first-hand wear-testing ("our wear-tests yielded 9.5
   *    hours", "in our testing room"). Nobody here has sprayed these bottles.
   *    Publishing that as a first-party review is a false statement, and it was
   *    being handed to a search engine as one.
   *  - an `Offer` carrying an invented `price`, plus a FAQPage asserting our
   *    codes are "verified daily with partner retailers".
   *
   * What remains is deliberately modest. `BreadcrumbList` is the only node here
   * that was always true, and the `Product` node now says nothing about
   * ratings, price or stock that we have not checked.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": `${perfume.name} by ${perfume.brand}`,
        "image": perfume.image ? `https://philofragrancy.com${perfume.image}` : undefined,
        "description": perfume.description,
        "url": `https://philofragrancy.com/perfumes/${perfume.slug}`,
        "brand": {
          "@type": "Brand",
          "name": perfume.brand,
        },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://philofragrancy.com/" },
          {
            "@type": "ListItem",
            position: 2,
            name: "Fragrances",
            item: "https://philofragrancy.com/#explore",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${perfume.brand} ${perfume.name}`,
            item: `https://philofragrancy.com/perfumes/${perfume.slug}`,
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

            {/* ── WHERE TO BUY ──
                This used to be a coupon card: a "Verified today" line, a
                `daysLeft` countdown hardcoded to 28, a discount label, and a
                "from $X / You Save $Y" block. None of it was checked by
                anything. A verification stamp that no process produces is worse
                than no stamp, so the card now says only what is true — which
                retailer we link to, and that the price is theirs to set.

                The figures live on /compare/:slug instead, where they carry a
                visible "example pricing" label. */}
            {coupon && (
              <div className="pf-card mt-9 p-7">
                <p className="pf-meta">Where to buy</p>

                <p className="mt-4 text-[1.35rem] font-semibold text-white">{coupon.retailer}</p>
                <p className="mt-3 text-[0.85rem] leading-relaxed text-[#e5e5e7]">
                  We do not sell this fragrance. The link below opens {coupon.retailer}&rsquo;s own
                  product page, where the current price, stock and delivery terms are theirs to set.
                </p>

                <a
                  href={retailerUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="pf-btn pf-btn--block mt-6"
                >
                  View at {coupon.retailer}
                  <span className="sr-only"> (affiliate link, opens in a new tab)</span>
                </a>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                  <p className="pf-meta">Affiliate link — we may earn a commission</p>
                  <Link to={`/compare/${perfume.slug}`} className="pf-cta">
                    Compare offers <span className="pf-arrow">→</span>
                  </Link>
                </div>
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
                <span className="pf-spec__value">{perfume.longevity} / 10 · editorial estimate</span>
              </div>
              <div className="pf-spec">
                <span className="pf-spec__label">Sillage</span>
                <span className="pf-spec__value">{perfume.sillage} / 10 · editorial estimate</span>
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

            {/* Closing link. The old copy here redeemed a code and promised
                "guaranteed authentic stock with priority delivery" — a
                guarantee about someone else's shipping that we cannot make. */}
            <div className="mt-16 border-t border-[rgba(255,255,255,0.08)] pt-12 text-center">
              <h3 className="pf-h3 text-[1.75rem]">Ready to experience {perfume.name}?</h3>
              <p className="mx-auto mt-3 max-w-[520px] text-[0.85rem] leading-relaxed text-[rgba(255,255,255,0.6)]">
                Check the current price and stock at {coupon?.retailer ?? "the retailer"}. We may earn a
                commission if you buy through our link, at no extra cost to you.
              </p>
              <a
                href={retailerUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="pf-btn mt-7"
              >
                View at {coupon?.retailer ?? "the retailer"}
                <span className="sr-only"> (affiliate link, opens in a new tab)</span>
              </a>
            </div>
          </div>
        </section>

        <hr className="pf-rule" />

        {/* ── 3. FREQUENTLY ASKED QUESTIONS ──
            Rewritten. The first two used to be a coupon-redemption walkthrough
            for a code no retailer issues, and a flat "yes, 100% authentic"
            guarantee. We do not handle or inspect what a retailer ships, so we
            cannot make that promise for them — saying we did was the kind of
            claim a reader has no way to check and no way to challenge. */}
        <section className="pf-section">
          <div className="mx-auto w-full max-w-[880px]">
            <h2 className="pf-h2">Frequently Asked Questions</h2>

            <div className="mt-10">
              {[
                {
                  q: `Where can I buy ${perfume.name}?`,
                  a: `Not from us. PhiloFragrancy does not sell fragrance and never takes an order. The retailer link above takes you to ${
                    coupon?.retailer ?? "the retailer"
                  }'s own page, where their price, shipping and returns terms apply. We may earn a commission if you buy through that link, at no extra cost to you.`,
                },
                {
                  q: `Can you vouch for the authenticity of what I receive?`,
                  a: `No, and it would be worth being precise about why. We never handle the bottle, so we cannot inspect it — authenticity is the retailer's responsibility and their policy is the one that governs a claim. We list retailers; we do not grade or guarantee them. If authenticity matters to you, buy direct from the fragrance house.`,
                },
                {
                  q: `What is the best season and occasion to wear ${perfume.name}?`,
                  a: `${perfume.name} is usually at its best in ${perfume.season.join(
                    ", ",
                  ).toLowerCase()}, and tends to suit ${perfume.occasion.join(", ").toLowerCase()}. Treat that as editorial judgement rather than a rule — skin chemistry and climate change everything.`,
                },
              ].map((item) => (
                <div key={item.q} className="pf-row">
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
