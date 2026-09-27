import { Link, useSearchParams } from "react-router";

import { PERFUMES, type Perfume } from "@/data/coupons";
import { pathForSlug } from "@/data/deals";

import { SearchField } from "@/components/deal/SearchField";

export function meta({ location }: { location: { search: string } }) {
  const q = new URLSearchParams(location.search).get("q")?.trim() ?? "";
  const heading = q ? `“${q}”` : "Everything in the collection";

  return [
    { title: `${heading} — Search | PhiloFragrancy` },
    {
      name: "description",
      content:
        "Search the PhiloFragrance catalogue by fragrance name, house, scent family or individual note.",
    },
    // A search result page has no business in an index, and the empty variant
    // is the one a crawler is most likely to land on.
    { name: "robots", content: "noindex, follow" },
  ];
}

const SUGGESTIONS = ["Aventus", "Sauvage", "Bleu de Chanel", "Oud Wood", "Layton", "oud", "vanilla"] as const;

/**
 * Everything a reader could plausibly type, in one string.
 *
 * Notes are searchable on purpose. "Oud" and "vanilla" are how people actually
 * search for fragrance — they do not know they want Oud Wood, they know they
 * want something woody. Matching only on name and brand would return nothing
 * for the query the reader most likely has.
 */
function haystack(perfume: Perfume): string {
  return [
    perfume.name,
    perfume.brand,
    perfume.family,
    perfume.concentration,
    ...perfume.topNotes,
    ...perfume.heartNotes,
    ...perfume.baseNotes,
  ]
    .join(" ")
    .toLowerCase();
}

function search(query: string): Perfume[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return PERFUMES;

  return PERFUMES.filter((perfume) => {
    const text = haystack(perfume);
    return terms.every((term) => text.includes(term));
  });
}

export default function SearchRoute() {
  const [params] = useSearchParams();
  const query = params.get("q")?.trim() ?? "";
  const results = search(query);
  const searching = query.length > 0;

  return (
    <div className="w-full bg-[#070707] text-[#e5e5e7]">
      <section className="border-b border-white/10">
        <div className="pf-container py-14 md:py-16">
          <p className="pf-eyebrow">Search</p>
          <h1 className="pf-h2 mt-3 max-w-[680px]">
            {searching ? (
              <>
                {results.length === 0 ? "Nothing matches" : "Results for"}{" "}
                <span className="italic text-[#d4af37]">“{query}”</span>
              </>
            ) : (
              "Find a fragrance"
            )}
          </h1>

          <div className="mt-8 max-w-[640px]">
            <SearchField
              id="pf-search-page"
              defaultValue={query}
              autoFocus={!searching}
              suggestions={searching ? [] : SUGGESTIONS}
            />
          </div>
        </div>
      </section>

      <section className="pf-section">
        <div className="pf-container">
          {results.length === 0 ? (
            /* The empty state earns its space by saying what to do next, not by
               restating that nothing was found. */
            <div className="max-w-[560px]">
              <p className="pf-lede">
                No fragrance in the collection matches that. Try a house name, a scent family, or a
                single note — <span className="text-white">oud</span> and{" "}
                <span className="text-white">vanilla</span> both return several.
              </p>
              <Link to="/" className="pf-cta mt-6">
                Back to the collection <span className="pf-arrow">→</span>
              </Link>
            </div>
          ) : (
            <ul className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((perfume) => (
                <li key={perfume.id}>
                  <Link
                    to={pathForSlug(perfume.slug)}
                    className="pf-group flex h-full flex-col bg-[#070707] p-6 no-underline transition-colors duration-200 hover:bg-[#0b0b0c]"
                  >
                    <p className="pf-meta">{perfume.brand}</p>
                    <h2 className="pf-h3 mt-2 text-[1.35rem]">{perfume.name}</h2>
                    <p className="pf-lede mt-2 line-clamp-2 flex-1 text-[0.88rem]">{perfume.description}</p>
                    <p className="pf-meta mt-5">{perfume.concentration}</p>
                    <span className="pf-cta mt-4">
                      {pathForSlug(perfume.slug).startsWith("/compare") ? "Compare & read" : "View Fragrance"}{" "}
                      <span className="pf-arrow">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
