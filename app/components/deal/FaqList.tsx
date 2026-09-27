import { useState } from "react";

import { DEAL_FAQS } from "@/data/deals";

/**
 * Purchase-intent questions, one open at a time.
 *
 * There is no "Is <retailer> legit?" here, and that omission is deliberate.
 * We link to retailers; we do not vet them, and answering as though we had
 * would be a claim this site cannot support. There is also no "how do these
 * coupons work" question, because we do not issue coupons.
 */
export function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {DEAL_FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        // Stable across toggles. Deriving the id from the open state would
        // rename the panel every time it expanded, which breaks the
        // aria-controls relationship for anything tracking the association.
        const triggerId = `pf-faq-trigger-${index}`;
        const panelId = `pf-faq-panel-${index}`;

        return (
          <div key={faq.question} className="pf-faq">
            <h3>
              <button
                type="button"
                id={triggerId}
                className="pf-faq__btn"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{faq.question}</span>
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
              /* The panel keeps its place in the accessibility tree when
                 collapsed: it holds no focusable content, so nothing can be
                 stranded inside it, and a screen-reader user still gets the
                 answer without having to guess which question is open. */
            >
              <div>
                <p className="pf-faq__answer">{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
