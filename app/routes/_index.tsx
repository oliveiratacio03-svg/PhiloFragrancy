import { useState } from "react";
import { Link } from "react-router";

import { PERFUMES, type Perfume } from "@/data/coupons";
import { DEAL_STEPS, FEATURED_DEALS } from "@/data/deals";

import { DealCard } from "@/components/deal/DealCard";
import { FaqList } from "@/components/deal/FaqList";
import { SampleNote } from "@/components/deal/Money";
import { PriceTable } from "@/components/deal/PriceTable";
import { SearchField } from "@/components/deal/SearchField";

export function meta() {
  return [
    { title: "PhiloFragrancy — Compare Fragrance Offers & Read Independent Reviews" },
    {
      name: "description",
      content:
        "Search designer and niche fragrance, compare the retailer offers listed for each one, and read independent editorial on the notes, the drydown and the value.",
    },
    { name: "og:title", content: "PhiloFragrancy — Compare Fragrance Offers & Read Independent Reviews" },
    {
      name: "og:description",
      content:
        "Compare retailer offers side by side, then read what the fragrance actually smells like before you buy.",
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

const SUGGESTIONS = ["Aventus", "Sauvage", "Bleu de Chanel", "Oud Wood", "Layton"] as const;

function matchesFilter(perfume: Perfume, filter: FilterId): boolean {
  if (filter === "all") return true;
  const family = perfume.family.toLowerCase();
  if (filter === "woody") return family.includes("woody") || family.includes("amber");
  if (filter === "oriental") return family.includes("oriental") || family.includes("spicy");
  if (filter === "fresh")
    return family.includes("floral") || family.includes("fruity") || family.includes("aromatic");
  return true;
}

function Packshot({ perfume }: { perfume: Perfume }) {
  if (perfume.image) {
    return <img src={perfume.image} alt="" loading="lazy" />;
  }
  return (
    <div className="pf-packshot-empty">
      <span className="pf-packshot-empty__brand">{perfume.brand}</span>
      <span className="pf-packshot-empty__name">{perfume.name}</span>
      <span className="pf-packshot-empty__brand">Photography pending</span>
    </div>
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

export default function HomeRoute() {
  const [activeTab, setActiveTab] = useState<FilterId>("all");

  /* Featured reviews follow the same three products as the offer cards, so the
     two sections reinforce each other instead of pointing at four different
     things. This used to sort by `rating` and take the top three — which meant
     the homepage decided what to feature using a number nobody earned. */
  const reviews = FEATURED_DEALS.map((deal) => PERFUMES.find((p) => p.slug === deal.slug)).filter(
    (p): p is Perfume => Boolean(p),
  );
  const filteredPerfumes = PERFUMES.filter((p) => matchesFilter(p, activeTab));

  return (
    <div className="w-full bg-[#070707] text-[#e5e5e7]">
      {/* ── 1. HERO — search first ──
          The wordmark block that used to hold this space is gone. The header
          already carries the brand, and the one thing a reader arrives here to
          do is find a fragrance, so the field gets the position instead. */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pf-container grid items-center gap-12 py-16 md:grid-cols-[1fr_360px] md:py-20">
          <div className="max-w-[620px]">
            <p className="pf-eyebrow">Designer &amp; niche fragrance</p>
            <h1
              className="mt-4 text-white"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2.6rem, 6vw, 4.4rem)",
                fontWeight: 400,
                lineHeight: 1.02,
                margin: 0,
              }}
            >
              Premium Fragrances
            </h1>

            <div className="mt-9">
              <SearchField suggestions={SUGGESTIONS} />
            </div>
          </div>

          {/* Venus, reduced to a contained panel beside the field. Hidden on
              narrow screens: it is the heaviest asset on the page and it does
              not help anyone find a fragrance. */}
          <div className="relative hidden aspect-square overflow-hidden md:block">
            <img
              src="/images/venus-hero.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "center 47%" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(7,7,7,0.25) 0%, rgba(7,7,7,0.65) 72%, #070707 100%)",
              }}
            />
          </div>
        </div>
      </section>

      {/* ── 2. FEATURED DEALS ── */}
      <section id="featured" className="pf-section">
        <div className="pf-container">
          <SectionHead
            eyebrow="Price comparison"
            title={
              <>
                Three to start <span className="italic text-[#d4af37]">with.</span>
              </>
            }
          />

          <div className="mt-5">
            <SampleNote />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_DEALS.map((deal) => (
              <DealCard key={deal.slug} deal={deal} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ── */}
      <section className="border-y border-white/10 bg-[#F5F2EB] py-20 text-[#18181b] sm:py-24">
        <div className="pf-container">
          <p className="pf-eyebrow" style={{ color: "#a46338" }}>
            How it works
          </p>
          <h2
            className="mt-4 max-w-[560px] text-[#111113]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.1rem, 4.2vw, 3.2rem)",
              lineHeight: 1.12,
              fontWeight: 400,
              margin: 0,
            }}
          >
            Three steps, no account.
          </h2>

          <div className="pf-steps mt-12">
            {DEAL_STEPS.map((step, index) => (
              <div key={step.title} className="pf-step">
                <p className="pf-step__num" style={{ color: "#b05934" }}>
                  {index + 1}
                </p>
                <h3
                  className="mt-5 text-[#111113]"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "1.45rem",
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  {step.title}
                </h3>
                <p className="mt-3 text-[0.92rem] leading-[1.7] text-[#52525b]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. PRICE COMPARISON TABLE ── */}
      <section id="compare" className="pf-section">
        <div className="pf-container">
          <SectionHead
            eyebrow="Side by side"
            title="Compare the recorded figures."
            lede="One row per fragrance, one column per retailer."
          />
          <div className="mt-10">
            <PriceTable />
          </div>
        </div>
      </section>

      {/* ── 5. FAQ ── */}
      <section id="faq" className="pf-section border-t border-white/10">
        <div className="pf-container">
          <div className="max-w-[560px]">
            <p className="pf-eyebrow">Before you buy</p>
            <h2 className="pf-h2 mt-3">Questions we can answer honestly.</h2>
          </div>
          <div className="mt-12 max-w-[820px]">
            <FaqList />
          </div>
        </div>
      </section>

      {/* ── 6. EXPLORE THE COLLECTION ── */}
      <section id="explore" className="pf-section border-t border-white/10">
        <div className="pf-container">
          <SectionHead
            eyebrow="The collection"
            title="Explore the collection"
            lede="Designer houses and niche labels, grouped by the family they belong to."
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
              {filteredPerfumes.map((perfume) => (
                <Link key={perfume.id} to={`/perfumes/${perfume.slug}`} className="pf-card pf-group h-full min-w-0">
                  <div className="pf-card__media aspect-[4/5] p-6">
                    <Packshot perfume={perfume} />
                  </div>
                  <div className="pf-card__body">
                    <p className="pf-meta">{perfume.brand}</p>
                    <h3 className="pf-h3 mt-2">{perfume.name}</h3>
                    <p className="pf-lede mt-3 line-clamp-2 text-[0.9rem]">{perfume.description}</p>

                    {/* No price here on purpose. The collection is a catalogue,
                        not a price list: a figure repeated on every card is a
                        claim repeated eight times, and most of these have no
                        checked price to show. Pricing lives in the deal cards
                        and the comparison table, where it means something. */}
                    <p className="pf-meta mt-auto border-t border-white/10 pt-5">{perfume.concentration}</p>

                    <span className="pf-cta mt-5">
                      View Fragrance <span className="pf-arrow">→</span>
                    </span>
                  </div>
                </Link>
              ))}
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
            lede="Scent profile, drydown and value, written for people deciding what to wear next."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.map((perfume) => (
              <article key={perfume.id} className="pf-card pf-group flex h-full flex-col p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="pf-meta min-w-0 flex-1">
                    {perfume.brand} · {perfume.concentration}
                  </p>
                  {/* No star rating here either. This used to print
                      `{rating} / 5` from the same invented numbers the product
                      page used to show as "verified ratings" — 4.8 for Aventus,
                      4.9 for Bleu, neither earned by anyone. The review text is
                      the reason to click. */}
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
    </div>
  );
}
