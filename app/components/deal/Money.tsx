import { formatMoney, PRICING_IS_SAMPLE } from "@/data/deals";

/**
 * A single money value, or an explicit "we do not have this".
 *
 * `null` never renders as zero, a dash, or a blank. A missing price shown as
 * an empty cell reads as "free" or "no data available" depending on who is
 * looking, and both are wrong. It says what it is.
 */
export function Money({ cents }: { cents: number | null }) {
  if (cents === null) {
    return <span className="pf-deal__unlisted">Not listed</span>;
  }
  return <span className="pf-deal__price">{formatMoney(cents)}</span>;
}

/**
 * The disclosure that makes the sample pricing above it safe to show.
 *
 * Rendered once per group of prices rather than once per number: a marker
 * repeated on every row stops being a disclosure and becomes decoration. When
 * real checked data replaces `deals.ts` this renders nothing at all, because
 * `PRICING_IS_SAMPLE` is the single switch.
 */
export function SampleNote() {
  if (!PRICING_IS_SAMPLE) return null;

  return (
    <p className="pf-sample">
      Example pricing — placeholders, not live quotes. Set by the retailer at checkout.
    </p>
  );
}
