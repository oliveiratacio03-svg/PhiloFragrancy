import { Link } from "react-router";

import { PERFUMES } from "@/data/coupons";
import { COMPARE_STORES, COMPARISON_ROWS, formatMoney, savingFor } from "@/data/deals";

import { SampleNote } from "./Money";

/**
 * Cross-store comparison, one fragrance per row.
 *
 * This is the densest surface on the site and it is meant to be. The job is
 * putting the columns next to each other, so the table stays a table and
 * scrolls sideways on a narrow screen instead of collapsing into accordions —
 * a comparison you have to expand one row at a time is not a comparison.
 *
 * A row only claims a saving when at least two stores have a number. With one
 * price there is nothing to save against, and printing "0%" would be a
 * fabricated claim about a store we simply have not checked.
 */
export function PriceTable() {
  const rows = COMPARISON_ROWS.map((row) => {
    const perfume = PERFUMES.find((p) => p.slug === row.slug);
    return perfume ? { row, perfume, saving: savingFor(row) } : null;
  }).filter((r): r is NonNullable<typeof r> => r !== null);

  return (
    <div>
      <div className="pf-table-scroll">
        <table className="pf-table">
          <caption className="sr-only">
            Example prices for each fragrance by retailer, with the difference between the
            lowest and highest figure we have recorded.
          </caption>
          <thead>
            <tr>
              <th scope="col">Fragrance</th>
              {COMPARE_STORES.map((store) => (
                <th key={store} scope="col">
                  {store}
                </th>
              ))}
              <th scope="col">Difference</th>
              <th scope="col">
                <span className="sr-only">Compare</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ row, perfume, saving }) => (
              <tr key={perfume.slug}>
                <th scope="row" style={{ fontWeight: 400, textAlign: "left" }}>
                  <Link to={`/perfumes/${perfume.slug}`} className="pf-link">
                    {perfume.name}
                  </Link>{" "}
                  <span className="pf-meta">{perfume.brand}</span>
                </th>

                {COMPARE_STORES.map((store) => {
                  const cents = row.stores[store];
                  return (
                    <td key={store}>
                      {typeof cents === "number" ? formatMoney(cents) : <span className="pf-deal__unlisted">Not listed</span>}
                    </td>
                  );
                })}

                <td>
                  {saving ? (
                    <span className="pf-save">{formatMoney(saving.lowestCents)} · {saving.percent}% less</span>
                  ) : (
                    <span className="pf-deal__unlisted">—</span>
                  )}
                </td>

                <td>
                  <Link to={`/compare/${perfume.slug}`} className="pf-cta">
                    View <span className="pf-arrow">→</span>
                    <span className="sr-only"> all offers for {perfume.name}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <SampleNote />
      </div>
    </div>
  );
}
