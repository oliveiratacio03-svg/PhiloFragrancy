import { Link } from "react-router";

type Sections = {
  quickOverview: string;
  scentDescription: string;
  noteBreakdown: { top: string[]; heart: string[]; base: string[]; source: string };
  scentProfile: { attribute: string; intensity: string }[];
  performance: string;
  fragranceDevelopment: string;
  bestSeasons: { season: string; reason: string }[];
  bestOccasions: { occasion: string; reason: string }[];
  whoIsItFor: string;
  strengths: string[];
  considerations: string[];
  value: string;
  similarFragrances: string[];
  take: string;
  faq: { question: string; answer: string }[];
};

type Offer = {
  id: string;
  retailer: string;
  affiliateUrl: string;
  price: number | null;
  referencePrice: number | null;
  currency: string;
  discountLabel: string | null;
  availability: string;
};

export type FragranceReviewData = {
  review: {
    id: string;
    version: number;
    status: string;
    model: string;
    promptVersion: string;
    sourcesCount: number;
    sections: Sections;
    completedSections: number;
    qc: { check: string; severity: string; detail: string }[];
  } | null;
  offers: Offer[];
};

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** A section with content, or nothing at all — never an empty heading. */
function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pf-section">
      <div className="pf-container-narrow">
        {eyebrow && <p className="pf-eyebrow">{eyebrow}</p>}
        <h2 className={`pf-h2 ${eyebrow ? "mt-3" : ""}`}>{title}</h2>
        <div className="pf-prose mt-6">{children}</div>
      </div>
    </section>
  );
}

function WhereToBuy({ offers }: { offers: Offer[] }) {
  if (offers.length === 0) return null;
  return (
    <section className="pf-section">
      <div className="pf-container-narrow">
        <p className="pf-eyebrow">Where to buy</p>
        <h2 className="pf-h2 mt-3">Current offers</h2>
        <div className="mt-8">
          {offers.map((offer) => (
            <div key={offer.id} className="pf-offer">
              <div>
                <p className="pf-offer__retailer">{offer.retailer}</p>
                <p className="pf-offer__price">
                  {offer.price === null ? "Price unavailable" : `$${offer.price.toFixed(0)}`}
                  {offer.referencePrice !== null && offer.price !== null && offer.referencePrice > offer.price && (
                    <s>${offer.referencePrice.toFixed(0)}</s>
                  )}
                </p>
              </div>
              <a
                href={offer.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="pf-cta whitespace-nowrap"
              >
                View offer <span className="pf-arrow">→</span>
              </a>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[0.78rem] leading-[1.7] text-white/40">
          Prices and availability are set by the retailer and may change without notice.
        </p>
      </div>
    </section>
  );
}

export function FragranceReview({ data, fallback }: { data: FragranceReviewData; fallback?: React.ReactNode }) {
  const { review, offers } = data;
  if (!review) return <>{fallback ?? null}</>;

  const s = review.sections;
  const has = (v: string) => v.trim().length > 0;

  return (
    <>
      <article>
        {review.status !== "published" && (
          <div className="border-b border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.06)]">
            <div className="pf-container-narrow py-4 text-[0.78rem] tracking-[0.1em] uppercase text-[#d4af37]">
              Draft · {review.completedSections} of 15 sections written · not published
            </div>
          </div>
        )}

        {has(s.quickOverview) && (
          <section className="pf-section">
            <div className="pf-container-narrow">
              <p className="pf-eyebrow">Quick overview</p>
              <p className="pf-prose mt-5 text-[1.05rem]">{s.quickOverview}</p>
            </div>
          </section>
        )}

        {has(s.scentDescription) && (
          <Section eyebrow="The scent" title="What does it smell like?">
            <p>{s.scentDescription}</p>
          </Section>
        )}

        {(s.noteBreakdown.top.length > 0 || s.noteBreakdown.heart.length > 0 || s.noteBreakdown.base.length > 0) && (
          <Section eyebrow="Composition" title="Note breakdown">
            <div className="mt-2 space-y-6">
              {(
                [
                  ["Top notes", s.noteBreakdown.top],
                  ["Heart notes", s.noteBreakdown.heart],
                  ["Base notes", s.noteBreakdown.base],
                ] as const
              ).map(([label, notes]) =>
                notes.length === 0 ? null : (
                  <div key={label}>
                    <p className="pf-meta mb-2">{label}</p>
                    <div className="flex flex-wrap gap-2">
                      {notes.map((note) => (
                        <span key={note} className="pf-tag">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
            {s.noteBreakdown.source && (
              <p className="mt-6 text-[0.78rem] text-white/40">Source: {s.noteBreakdown.source}</p>
            )}
          </Section>
        )}

        {s.scentProfile.length > 0 && (
          <Section eyebrow="Profile" title="Scent profile">
            <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
              {s.scentProfile.map((p) => (
                <li key={p.attribute} className="text-[0.9rem] text-white/75">
                  <span className="text-white">{p.attribute}</span>{" "}
                  <span className="text-white/45">· {p.intensity}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {has(s.performance) && (
          <Section eyebrow="Performance" title="Longevity and projection">
            <p>{s.performance}</p>
          </Section>
        )}

        {has(s.fragranceDevelopment) && (
          <Section eyebrow="Development" title="How it evolves">
            <p>{s.fragranceDevelopment}</p>
          </Section>
        )}

        {s.bestSeasons.length > 0 && (
          <Section eyebrow="Seasons" title="Best seasons">
            <ul className="m-0 list-none space-y-3 p-0">
              {s.bestSeasons.map((item) => (
                <li key={item.season}>
                  <span className="text-white">{item.season}</span> — <span>{item.reason}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {s.bestOccasions.length > 0 && (
          <Section eyebrow="Occasions" title="Best occasions">
            <ul className="m-0 list-none space-y-3 p-0">
              {s.bestOccasions.map((item) => (
                <li key={item.occasion}>
                  <span className="text-white">{item.occasion}</span> — <span>{item.reason}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {has(s.whoIsItFor) && (
          <Section eyebrow="Audience" title="Who is it for?">
            <p>{s.whoIsItFor}</p>
          </Section>
        )}

        {s.strengths.length > 0 && (
          <Section eyebrow="Considerations" title="Strengths">
            <ul className="m-0 list-none space-y-2 p-0">
              {s.strengths.map((item) => (
                <li key={item}>— {item}</li>
              ))}
            </ul>
          </Section>
        )}

        {s.considerations.length > 0 && (
          <Section title="Things to consider">
            <ul className="m-0 list-none space-y-2 p-0">
              {s.considerations.map((item) => (
                <li key={item}>— {item}</li>
              ))}
            </ul>
          </Section>
        )}

        {has(s.value) && (
          <Section title="Value">
            <p>{s.value}</p>
          </Section>
        )}

        {s.similarFragrances.length > 0 && (
          <Section title="Similar fragrances">
            <ul className="m-0 list-none space-y-2 p-0">
              {s.similarFragrances.map((slug) => (
                <li key={slug}>
                  <Link to={`/perfumes/${slug}`} className="pf-link">
                    {slug.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {has(s.take) && (
          <section className="pf-section">
            <div className="pf-container-narrow">
              <p className="pf-eyebrow">The take</p>
              <blockquote className="mt-5 border-l-[3px] border-l-[#d4af37] pl-6 font-serif-luxury text-[1.25rem] italic leading-relaxed text-[#e5e5e7]">
                {s.take}
              </blockquote>
            </div>
          </section>
        )}

        {s.faq.length > 0 && (
          <section className="pf-section">
            <div className="pf-container-narrow">
              <h2 className="pf-h2">Frequently asked questions</h2>
              <div className="mt-10">
                {s.faq.map((item) => (
                  <div key={item.question} className="pf-row">
                    <h3 className="pf-h3 text-[1.1rem]">{item.question}</h3>
                    <p className="pf-lede mt-2 text-[0.95rem]">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <WhereToBuy offers={offers} />
    </>
  );
}

export { slugify };
