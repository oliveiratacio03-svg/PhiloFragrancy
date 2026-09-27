import { useState } from "react";
import { Link, useParams } from "react-router";

import { PERFUMES } from "@/data/coupons";
import { compareFaqFor } from "@/data/compare-faq";
import { dealForSlug, formatMoney, PRICING_IS_SAMPLE, similarTo } from "@/data/deals";

import { SampleNote } from "@/components/deal/Money";
import { WishButton } from "@/components/deal/WishButton";

export function meta({ params }: { params: { slug: string } }) {
  const perfume = PERFUMES.find((p) => p.slug === params.slug);
  if (!perfume) return [{ title: "Fragrance Not Found — PhiloFragrancy" }];

  return [
    {
      title: `${perfume.name} by ${perfume.brand} — Compare Offers & Read the Review | PhiloFragrancy`,
    },
    {
      name: "description",
      content: `The retailer offers listed for ${perfume.name} by ${perfume.brand} side by side, an independent read on the composition, and the fragrances closest to it.`,
    },
    { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large" },
  ];
}

type Accordion = { question: string; answer: string };

/* ── Offer card ─────────────────────────────────────────────────────────────
   One retailer, one decision. The card's job is to make "where do I buy this"
   answerable, so the price is the largest thing on it and the call to action is
   a plain labelled affiliate link.

   There is no coupon code here, deliberately. A code box implies a discount we
   can honour, and the codes this project carried were not issued by any
   retailer — a "Copy" button that produces a string which does not work is a
   broken promise with a green flash on it. The retailer applies whatever is
   genuinely on offer at their checkout. */

function OfferCard({
  offer,
  perfumeName,
  isBest,
  bestCents,
}: {
  offer: { retailer: string; priceCents: number | null; referencePriceCents: number | null; discountLabel: string | null; url: string };
  perfumeName: string;
  isBest: boolean;
  bestCents: number | null;
}) {
  const saving =
    offer.priceCents !== null && bestCents !== null && offer.priceCents > bestCents
      ? offer.priceCents - bestCents
      : 0;

  return (
    <div
      className="pf-deal"
      style={isBest ? { borderColor: "rgba(212, 175, 55, 0.5)" } : undefined}
    >
      <div className="pf-deal__body">
        <div className="flex items-center justify-between gap-3">
          <p className="pf-meta">{offer.retailer}</p>
          {isBest && <span className="pf-tag pf-tag--gold">Lowest listed</span>}
        </div>

        <p className="pf-offer__price mt-4 text-[1.75rem]">
          {offer.priceCents === null ? (
            <span className="pf-deal__unlisted">Price not recorded</span>
          ) : (
            <>
              {formatMoney(offer.priceCents)}
              {offer.referencePriceCents !== null && (
                <s>{formatMoney(offer.referencePriceCents)}</s>
              )}
            </>
          )}
        </p>

        {offer.discountLabel && <span className="pf-tag pf-tag--gold mt-3">{offer.discountLabel}</span>}

        {saving > 0 && (
          <p className="pf-meta mt-3">
            {formatMoney(saving)} more than the lowest listed price
          </p>
        )}

        {/* `mt-auto` pins the button to the bottom of the card so the buttons
            line up across a row even when one retailer has no price recorded
            and its card is shorter. */}
        <div className="mt-auto pt-8">
          <a
            href={offer.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="pf-btn pf-btn--block"
          >
            Go to {offer.retailer}
            <span className="sr-only"> — {perfumeName} (affiliate link, opens in a new tab)</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── FAQ ───────────────────────────────────────────────────────────────────
   Reuses the same disclosure pattern as the homepage list: a button with
   aria-expanded and aria-controls, and a panel that animates on
   grid-template-rows so nothing has to be measured. */

function Faq({ items }: { items: Accordion[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, index) => {
        const isOpen = open === index;
        const triggerId = `pf-cmp-faq-trigger-${index}`;
        const panelId = `pf-cmp-faq-panel-${index}`;

        return (
          <div key={item.question} className="pf-faq">
            <h3>
              <button
                type="button"
                id={triggerId}
                className="pf-faq__btn"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <span>{item.question}</span>
                <span className="pf-faq__sign" aria-hidden="true">
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="pf-faq__panel"
              data-open={isOpen}
            >
              <div>
                <p className="pf-faq__answer">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CompareRoute() {
  const { slug } = useParams();
  const perfume = PERFUMES.find((p) => p.slug === slug);

  if (!perfume) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#070707] p-8 text-center">
        <h1 className="pf-h2">Fragrance not found</h1>
        <p className="pf-lede mt-4 max-w-[420px]">
          There is no comparison for that. It may be a fragrance we have not added yet.
        </p>
        <Link to="/search" className="pf-btn mt-8">
          Search the collection
        </Link>
      </div>
    );
  }

  const deal = dealForSlug(perfume.slug);
  const offers = deal?.offers ?? [];
  const priced = offers.filter((o) => o.priceCents !== null);
  const bestCents = priced.length > 0 ? Math.min(...priced.map((o) => o.priceCents as number)) : null;
  const similar = similarTo(perfume.slug);

  /* The price question is shared rather than written eight times: one honest
     answer serves every fragrance, and eight copies would be eight chances for
     the wording to drift into something we cannot support. */
  const priceQuestion: Accordion = {
    question: `Is ${perfume.name} worth what the retailers are asking?`,
    answer:
      "That is a judgement we cannot make for you, and pretending otherwise would be the whole problem. What we can say is what the composition is, so you can decide whether it is the kind of scent you want before a price is attached to it. The figures on this page are placeholders, and the retailer sets the real price at their own checkout — where you can also read their shipping and returns terms. Buying direct from the fragrance house is the option with the least ambiguity about where the bottle came from.",
  };

  const faq: Accordion[] = [...compareFaqFor(perfume), priceQuestion];

  return (
    <div className="w-full bg-[#070707] text-[#e5e5e7]">
      {/* ── 1. BREADCRUMB + HEADER ── */}
      <section className="border-b border-white/10">
        <div className="pf-container">
          <nav aria-label="Breadcrumb" className="pf-meta flex flex-wrap items-center gap-x-2 gap-y-1 py-7">
            <Link to="/" className="pf-link">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link to="/search" className="pf-link">
              Fragrances
            </Link>
            <span aria-hidden="true">/</span>
            <span className="pf-link--gold">{perfume.name}</span>
          </nav>

          <div className="grid items-center gap-10 pb-14 md:grid-cols-[300px_1fr]">
            <div className="pf-card__media aspect-square bg-white p-8">
              {perfume.image ? (
                <img src={perfume.image} alt={`${perfume.brand} ${perfume.name}`} />
              ) : (
                <div className="pf-packshot-empty">
                  <span className="pf-packshot-empty__brand">{perfume.brand}</span>
                  <span className="pf-packshot-empty__name">{perfume.name}</span>
                </div>
              )}
            </div>

            <div>
              <p className="pf-eyebrow">{perfume.brand}</p>
              <h1 className="pf-h1 mt-3 text-[clamp(2.4rem,5vw,3.6rem)]">{perfume.name}</h1>
              <p className="pf-meta mt-3">
                {perfume.concentration} · {perfume.family}
              </p>
              <p className="pf-lede mt-6 max-w-[620px]">{perfume.description}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={`/perfumes/${perfume.slug}`} className="pf-btn">
                  Full review
                </Link>
                <WishButton slug={perfume.slug} name={perfume.name} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. PRICE COMPARISON ── */}
      <section id="offers" className="pf-section">
        <div className="pf-container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="pf-h2">Where it is listed</h2>
            <SampleNote />
          </div>

          {offers.length === 0 ? (
            <div className="mt-8 max-w-[560px] border-t border-white/10 pt-8">
              <p className="pf-lede">
                We do not list a retailer offer for this fragrance yet. Nothing is withheld
                here — there is genuinely nothing checked to show.
              </p>
              <Link to="/#compare" className="pf-cta mt-6">
                See what we can price <span className="pf-arrow">→</span>
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {offers.map((offer) => (
                  <OfferCard
                    key={offer.retailer}
                    offer={offer}
                    perfumeName={perfume.name}
                    isBest={bestCents !== null && offer.priceCents === bestCents}
                    bestCents={bestCents}
                  />
                ))}
              </div>

              {/* The insight only appears when there is a real gap to describe. */}
              {bestCents !== null && priced.length > 1 && (
                <p className="pf-lede mt-8 max-w-[680px] text-[0.9rem]">
                  The lowest figure listed here is{" "}
                  <span className="text-white">{formatMoney(bestCents)}</span>
                  {priced.length - 1 > 0
                    ? `, and the other ${priced.length - 1 === 1 ? "retailer is" : `${priced.length - 1} retailers are`} higher. `
                    : ". "}
                  Check the retailer&rsquo;s own page before you buy — they set the price at
                  checkout, and these figures are placeholders rather than a live quote.
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── 3. THE REVIEW ── */}
      <section id="review" className="pf-section border-t border-white/10">
        <div className="pf-container">
          <div className="max-w-[620px]">
            <p className="pf-eyebrow">The review</p>
            <h2 className="pf-h2 mt-3">What you need to know.</h2>
          </div>

          <div className="pf-prose mt-10 max-w-[760px]">
            <p>{perfume.fullReview}</p>
          </div>

          {perfume.pros.length > 0 && perfume.cons.length > 0 && (
            <div className="mt-14 grid max-w-[900px] gap-10 sm:grid-cols-2">
              <div>
                <p className="pf-eyebrow">In its favour</p>
                <ul className="mt-5">
                  {perfume.pros.map((item) => (
                    <li key={item} className="pf-spec text-[0.92rem] leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="pf-eyebrow">Worth knowing first</p>
                <ul className="mt-5">
                  {perfume.cons.map((item) => (
                    <li key={item} className="pf-spec text-[0.92rem] leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-14 max-w-[760px] border-l-2 border-[#d4af37] pl-7">
            <p className="pf-eyebrow">The verdict</p>
            <p className="pf-prose mt-4">{perfume.expertVerdict}</p>
          </div>

          <p className="pf-meta mt-8 max-w-[720px]">
            The house publishes no performance figures and this review does not measure
            any. It describes the composition and what the materials do, which is enough
            to reason with — and not a substitute for wearing it.
          </p>
        </div>
      </section>

      {/* ── 4. NOTE PYRAMID ── */}
      <section className="pf-section border-t border-white/10">
        <div className="pf-container">
          <h2 className="pf-h3 text-[1.6rem]">Note pyramid</h2>
          <div className="mt-8 grid max-w-[900px] gap-8 sm:grid-cols-3">
            {(
              [
                ["Top", perfume.topNotes],
                ["Heart", perfume.heartNotes],
                ["Base", perfume.baseNotes],
              ] as const
            ).map(([stage, notes]) => (
              <div key={stage}>
                <p className="pf-eyebrow">{stage}</p>
                <ul className="mt-4">
                  {notes.map((note) => (
                    <li key={note} className="border-b border-white/10 py-2.5 text-[0.92rem] text-white/80">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="pf-meta mt-8 max-w-[720px]">
            Top notes are the most volatile and fade first; resins, woods and musks in the
            base are what carry the drydown. That ordering is the reason this review
            describes performance instead of measuring it.
          </p>
        </div>
      </section>

      {/* ── 5. SIMILAR ── */}
      {similar.length > 0 && (
        <section className="pf-section border-t border-white/10">
          <div className="pf-container">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="pf-eyebrow">Worth comparing against</p>
                <h2 className="pf-h2 mt-3">Close to {perfume.name}.</h2>
              </div>
              <p className="pf-meta max-w-[320px]">
                Matched on shared scent-family words and shared notes.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((item) => (
                <Link
                  key={item.slug}
                  to={`/compare/${item.slug}`}
                  className="pf-card pf-group h-full min-w-0"
                >
                  <div className="pf-card__media aspect-square p-6">
                    {item.image ? (
                      <img src={item.image} alt="" loading="lazy" />
                    ) : (
                      <div className="pf-packshot-empty">
                        <span className="pf-packshot-empty__brand">{item.brand}</span>
                        <span className="pf-packshot-empty__name">{item.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="pf-card__body">
                    <p className="pf-meta">{item.brand}</p>
                    <h3 className="pf-h3 mt-2 text-[1.25rem]">{item.name}</h3>
                    <p className="pf-meta mt-1.5">{item.family}</p>
                    <span className="pf-cta mt-5">
                      Compare <span className="pf-arrow">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. FAQ ── */}
      <section className="pf-section border-t border-white/10">
        <div className="pf-container">
          <div className="max-w-[620px]">
            <p className="pf-eyebrow">Before you decide</p>
            <h2 className="pf-h2 mt-3">Questions about {perfume.name}.</h2>
          </div>
          <div className="mt-10 max-w-[820px]">
            <Faq items={faq} />
          </div>
        </div>
      </section>

      {/* ── 7. FINAL CTA ── */}
      {offers.length > 0 && (
        <section className="pf-section border-t border-white/10">
          <div className="pf-container">
            <div className="mx-auto max-w-[620px] text-center">
              <h2 className="pf-h2">Ready to buy?</h2>
              <p className="pf-lede mt-4">
                Follow a retailer link and you will land on their own page, where the price,
                stock and delivery terms are theirs to set. We may earn a commission at no
                cost to you.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                {offers.map((offer) => (
                  <a
                    key={offer.retailer}
                    href={offer.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className={offer.priceCents === bestCents ? "pf-btn" : "pf-btn pf-btn--ghost"}
                  >
                    {offer.retailer}
                    <span className="sr-only"> — {perfume.name} (affiliate link, opens in a new tab)</span>
                  </a>
                ))}
              </div>

              {PRICING_IS_SAMPLE && (
                <p className="pf-meta mt-8">
                  The prices above are placeholders, not a live quote.
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
