import { useState } from "react";
import { Link } from "react-router";
import { PERFUMES, COUPONS, type Perfume } from "@/data/coupons";

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

const FILTERS = [
  { id: "all", label: "All Fragrances" },
  { id: "woody", label: "Woody & Amber" },
  { id: "oriental", label: "Warm & Spicy" },
  { id: "fresh", label: "Fresh & Floral" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

/* ── View models ────────────────────────────────────────────────────────────
   Everything below reads from `app/data/coupons.ts` and nowhere else. When the
   catalog moves to the database, these three mappers are the only thing that
   has to change — the markup consumes the shapes they return.
   ────────────────────────────────────────────────────────────────────────── */

/** One retailer offer for a fragrance. A fragrance can have several. */
type Offer = {
  retailer: string;
  price: number;
  referencePrice: number;
  discount?: string;
  url: string;
};

function offersFor(perfume: Perfume): Offer[] {
  const offers: Offer[] = [];
  for (const coupon of COUPONS.filter((c) => c.perfumeId === perfume.id)) {
    offers.push({
      retailer: coupon.retailer,
      price: perfume.discountedPrice,
      referencePrice: perfume.originalPrice,
      discount: coupon.discount,
      url: coupon.retailLink || perfume.affiliateUrl,
    });
  }
  return offers;
}

function couponFor(perfume: Perfume) {
  return COUPONS.find((c) => c.perfumeId === perfume.id);
}

/** Single-word scent tags taken from the fragrance family. */
function tagsFor(perfume: Perfume): string[] {
  return perfume.family.split(/\s+/).filter(Boolean).slice(0, 3);
}

/* ── Shared pieces ───────────────────────────────────────────────────────── */

function Packshot({ perfume, className }: { perfume: Perfume; className?: string }) {
  if (perfume.image) {
    return <img src={perfume.image} alt={`${perfume.brand} ${perfume.name}`} className={className} />;
  }
  return (
    <div className="pf-packshot-empty">
      <span className="pf-packshot-empty__brand">{perfume.brand}</span>
      <span className="pf-packshot-empty__name">{perfume.name}</span>
      <span className="pf-packshot-empty__brand">Photography pending</span>
    </div>
  );
}

function Price({ perfume }: { perfume: Perfume }) {
  return (
    <span className="text-[1.05rem] font-semibold text-white">
      ${perfume.discountedPrice}
      <s className="ml-2 text-[0.8rem] font-normal text-white/40">${perfume.originalPrice}</s>
    </span>
  );
}

function SectionHead({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
      <div className="max-w-[620px]">
        <p className="pf-eyebrow">{eyebrow}</p>
        <h2 className="pf-h2 mt-3">{title}</h2>
      </div>
      {lede && <p className="pf-lede max-w-[420px]">{lede}</p>}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function HomeRoute() {
  const [activeTab, setActiveTab] = useState<FilterId>("all");

  const featured = [
    PERFUMES.find((p) => p.slug === "creed-aventus"),
    PERFUMES.find((p) => p.slug === "bleu-de-chanel"),
    PERFUMES.find((p) => p.slug === "dior-sauvage"),
  ].filter(Boolean) as Perfume[];

  const comparison = [
    PERFUMES.find((p) => p.slug === "creed-aventus"),
    PERFUMES.find((p) => p.slug === "tom-ford-oud-wood"),
    PERFUMES.find((p) => p.slug === "parfums-de-marly-layton"),
  ].filter(Boolean) as Perfume[];

  const reviews = [...PERFUMES].sort((a, b) => b.rating - a.rating).slice(0, 3);

  const filteredPerfumes = PERFUMES.filter((p) => {
    if (activeTab === "all") return true;
    const family = p.family.toLowerCase();
    if (activeTab === "woody") return family.includes("woody") || family.includes("amber");
    if (activeTab === "oriental") return family.includes("oriental") || family.includes("spicy");
    if (activeTab === "fresh")
      return family.includes("floral") || family.includes("fruity") || family.includes("aromatic");
    return true;
  });

  return (
    <div className="w-full bg-[#070707] text-[#e5e5e7]">
      {/* ── 1. HERO ── */}
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden px-6">
        <div className="pointer-events-none absolute inset-0 z-[1]">
          <img
            src="/images/venus-hero.jpg"
            alt="Venus surrounded by flowers and celestial sphere"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center 47%" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 58% 54% at 50% 47%, rgba(7,7,7,0.6) 0%, rgba(7,7,7,0.3) 48%, transparent 78%)",
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-[110px]"
            style={{ background: "linear-gradient(to bottom, #070707 0%, rgba(7,7,7,0.5) 45%, transparent 100%)" }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[170px]"
            style={{ background: "linear-gradient(to top, #070707 0%, rgba(7,7,7,0.6) 40%, transparent 100%)" }}
          />
        </div>

        <div className="relative z-10 max-w-[700px] px-6 text-center">
          <h1
            className="text-[#ffffff] uppercase"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(3rem, 6.5vw, 5.2rem)",
              fontWeight: 500,
              letterSpacing: "0.18em",
              lineHeight: 0.95,
              textShadow: "0 4px 24px rgba(0,0,0,0.85)",
              margin: 0,
            }}
          >
            PHILO
          </h1>
          <div
            className="text-[#d4af37]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(2.3rem, 5vw, 4rem)",
              fontWeight: 400,
              letterSpacing: "0.04em",
              lineHeight: 1.1,
              marginTop: "-0.2rem",
              textShadow: "0 2px 18px rgba(0,0,0,0.9)",
            }}
          >
            FRAGRANCY
          </div>
          <p
            className="text-white/90"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(1.15rem, 2vw, 1.5rem)",
              fontStyle: "italic",
              letterSpacing: "0.04em",
              marginTop: "0.9rem",
              marginBottom: "2.25rem",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}
          >
            Find your signature.
          </p>

          <div className="flex flex-col items-center gap-4">
            <a href="#explore" className="pf-btn">
              Explore Offers <span className="pf-arrow">→</span>
            </a>
            <p className="text-[0.8rem] tracking-[0.06em] text-white/55" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
              Discover fragrances, offers and trusted retailers.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. FEATURED FRAGRANCES ── */}
      <section id="featured" className="pf-section">
        <div className="pf-container">
          <SectionHead
            eyebrow="Fragrances in focus"
            title={
              <>
                Three worth{" "}
                <span className="italic text-[#d4af37]">knowing.</span>
              </>
            }
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((perfume) => {
              const coupon = couponFor(perfume);
              const offer = offersFor(perfume)[0];
              return (
                <Link key={perfume.id} to={`/perfumes/${perfume.slug}`} className="pf-card pf-group h-full">
                  <div className="pf-card__media aspect-[4/5] p-7">
                    <Packshot perfume={perfume} />
                  </div>
                  <div className="pf-card__body">
                    <p className="pf-meta">{perfume.brand}</p>
                    <h3 className="pf-h3 mt-2 text-[1.6rem]">{perfume.name}</h3>
                    <p className="pf-meta mt-1.5">{perfume.concentration}</p>

                    <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-5">
                      <Price perfume={perfume} />
                      {coupon && <span className="pf-tag pf-tag--gold">{coupon.discount}</span>}
                    </div>

                    <span className="pf-cta mt-5">
                      View Offer <span className="pf-arrow">→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. EDITORIAL STATEMENT ── */}
      <section className="bg-[#F5F2EB] px-6 py-20 text-center text-[#18181b] sm:py-24">
        <div className="mx-auto max-w-[760px]">
          <p className="pf-eyebrow" style={{ color: "#a46338" }}>
            Fragrance intelligence
          </p>
          <h2
            className="mt-5 text-[#111113]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.3rem, 4.6vw, 3.6rem)",
              lineHeight: 1.12,
              fontWeight: 400,
              margin: 0,
            }}
          >
            The art of <span className="italic" style={{ color: "#b05934" }}>wearing well.</span>
          </h2>
          <div className="mx-auto mt-7 h-px w-12" style={{ background: "#d8cfc0" }} />
          <p className="mx-auto mt-7 max-w-[620px] text-[1rem] leading-[1.75] text-[#52525b]">
            Independent fragrance insight for a more intentional collection. We explore scent profiles, performance,
            value and available offers to help you discover fragrances worth wearing.
          </p>
        </div>
      </section>

      {/* ── 4. COMPARE BEFORE YOU BUY ── */}
      <section id="compare" className="pf-section">
        <div className="pf-container">
          <SectionHead
            eyebrow="Price comparison"
            title="Compare before you buy."
            lede="Explore available offers from trusted fragrance retailers and choose where to shop."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {comparison.map((perfume) => {
              const offers = offersFor(perfume);
              return (
                <div key={perfume.id} className="pf-compare">
                  <p className="pf-meta">{perfume.brand}</p>
                  <h3 className="pf-h3 mt-2">{perfume.name}</h3>
                  <p className="pf-meta mt-1">{perfume.concentration}</p>

                  <div className="mt-5 flex-1">
                    {offers.length === 0 && <p className="pf-meta">No retailer offer listed yet.</p>}
                    {offers.map((offer) => (
                      <div key={`${perfume.id}-${offer.retailer}`} className="pf-offer">
                        <div>
                          <p className="pf-offer__retailer">{offer.retailer}</p>
                          <p className="pf-offer__price">
                            ${offer.price}
                            <s>${offer.referencePrice}</s>
                          </p>
                        </div>
                        <a
                          href={offer.url}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="pf-cta whitespace-nowrap"
                        >
                          View Offer <span className="pf-arrow">→</span>
                        </a>
                      </div>
                    ))}
                  </div>

                  <Link to={`/perfumes/${perfume.slug}`} className="pf-cta mt-5">
                    Read the review <span className="pf-arrow">→</span>
                  </Link>
                </div>
              );
            })}
          </div>

          <p className="mt-8 max-w-[720px] text-[0.78rem] leading-[1.7] text-white/40">
            Offers are listed by the retailers we link to and are verified periodically. Prices and availability are set
            by the retailer and may change without notice.
          </p>
        </div>
      </section>

      {/* ── 5. BEGIN HERE ── */}
      <section id="discover" className="pf-section border-t border-white/10">
        <div className="pf-container">
          <SectionHead eyebrow="Navigate" title="Begin here." />

          <div className="mt-12">
            {[
              {
                title: "Coupons",
                desc: "Find current fragrance offers and retailer deals.",
                href: "/#explore",
              },
              {
                title: "Reviews",
                desc: "Explore detailed fragrance profiles and independent analysis.",
                href: "/#reviews",
              },
              {
                title: "Comparisons",
                desc: "Compare available offers before deciding where to buy.",
                href: "/#compare",
              },
              {
                title: "About",
                desc: "Learn what PhiloFragrance is and how the platform works.",
                href: "/about",
              },
            ].map((row) => (
              <Link key={row.title} to={row.href} className="pf-row pf-group flex items-center gap-6 no-underline">
                <span className="pf-h3 min-w-[180px] text-[1.4rem]">{row.title}</span>
                <span className="pf-lede hidden flex-1 text-[0.95rem] sm:block">{row.desc}</span>
                <span className="pf-arrow ml-auto text-[1.1rem] text-white/40">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. EXPLORE FRAGRANCES ── */}
      <section id="explore" className="pf-section border-t border-white/10">
        <div className="pf-container">
          <SectionHead
            eyebrow="The collection"
            title="Explore the collection"
            lede="Discover iconic fragrances, modern releases and scents worth knowing."
          />

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-b border-white/10 pb-5">
            {FILTERS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className="pf-filter"
                aria-pressed={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredPerfumes.length === 0 ? (
            <p className="pf-lede py-16 text-center">No fragrances match this family yet.</p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPerfumes.map((perfume) => {
                const coupon = couponFor(perfume);
                return (
                  <Link
                    key={perfume.id}
                    to={`/perfumes/${perfume.slug}`}
                    className="pf-card pf-group h-full min-w-0"
                  >
                    <div className="pf-card__media aspect-[4/5] p-6">
                      <Packshot perfume={perfume} />
                    </div>
                    <div className="pf-card__body">
                      <p className="pf-meta">{perfume.brand}</p>
                      <h3 className="pf-h3 mt-2">{perfume.name}</h3>
                      <p className="pf-lede mt-3 line-clamp-2 text-[0.9rem]">{perfume.description}</p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {tagsFor(perfume).map((tag) => (
                          <span key={tag} className="pf-tag">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-5">
                        <Price perfume={perfume} />
                        {coupon && <span className="pf-tag pf-tag--gold">{coupon.discount}</span>}
                      </div>

                      <span className="pf-cta mt-5">
                        View Fragrance <span className="pf-arrow">→</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── 7. FRAGRANCE REVIEWS ── */}
      <section id="reviews" className="pf-section border-t border-white/10 bg-[#050505]">
        <div className="pf-container">
          <SectionHead
            eyebrow="Editorial"
            title="Fragrance reviews"
            lede="Scent profile, performance and value, written for people deciding what to wear next."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.map((perfume) => (
              <article key={perfume.id} className="pf-card pf-group flex h-full flex-col p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="pf-meta min-w-0 flex-1">
                    {perfume.brand} · {perfume.concentration}
                  </p>
                  <p className="pf-eyebrow whitespace-nowrap">{perfume.rating} / 5</p>
                </div>
                <h3 className="pf-h3 mt-3 text-[1.4rem]">{perfume.name}</h3>
                <p className="pf-lede mt-4 line-clamp-4 flex-1 text-[0.95rem] italic">{perfume.expertVerdict}</p>
                <Link to={`/perfumes/${perfume.slug}`} className="pf-cta mt-6">
                  Read review <span className="pf-arrow">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. HOW WE EVALUATE ── */}
      <section id="standards" className="pf-section border-t border-white/10">
        <div className="pf-container">
          <div className="max-w-[640px]">
            <p className="pf-eyebrow">Editorial criteria</p>
            <h2 className="pf-h2 mt-3">How we evaluate fragrances</h2>
          </div>

          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Scent profile",
                desc: "Notes, accords and overall character.",
              },
              {
                title: "Performance",
                desc: "Longevity and projection based on available fragrance information and established reviews.",
              },
              {
                title: "Value",
                desc: "Price positioning and the retailer offers currently available.",
              },
              {
                title: "Transparency",
                desc: "A clear distinction between editorial information, retailer offers and affiliate relationships.",
              },
            ].map((item) => (
              <div key={item.title} className="border-t border-white/10 pt-6">
                <h3 className="pf-h3 text-[1.25rem]">{item.title}</h3>
                <p className="pf-lede mt-3 text-[0.9rem]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
