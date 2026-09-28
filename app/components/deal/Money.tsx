import { formatMoney, PRICING_IS_SAMPLE, recordedOnSummary } from "@/data/deals";

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
 * The disclosure that makes the price above it safe to show.
 *
 * Three states, because one label cannot honestly cover all of them:
 *
 *   - nothing recorded anywhere  → "example pricing". A placeholder.
 *   - some prices hand-recorded  → says so, and names the dates. "Recorded by
 *     hand" is not the same claim as "live", and a reader is entitled to the
 *     difference.
 *   - machine verified           → renders nothing, because there is nothing
 *     left to disclose.
 *
 * The mixed case is the one that matters most and the one a single boolean
 * would get wrong: three prices with a real date next to two without should not
 * print a blanket "example pricing", and should not print "updated" either.
 */
export function SampleNote() {
  if (!PRICING_IS_SAMPLE) return null;

  const summary = recordedOnSummary();

  if (summary.state === "none") {
    return (
      <p className="pf-sample">
        Example pricing — placeholders, not live quotes. Set by the retailer at checkout.
      </p>
    );
  }

  if (summary.state === "partial") {
    return (
      <p className="pf-sample">
        {summary.withDate} of {summary.total} prices were recorded by hand
        {summary.latest ? ` (${summary.latest})` : ""}; the rest are placeholders. The retailer sets
        the real figure at checkout.
      </p>
    );
  }

  return (
    <p className="pf-sample">
      Recorded by hand{summary.latest ? ` on ${summary.latest}` : ""}, not a live feed. The
      retailer sets the real figure at checkout.
    </p>
  );
}
