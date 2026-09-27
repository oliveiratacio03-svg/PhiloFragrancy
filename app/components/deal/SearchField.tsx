import { Form, Link } from "react-router";

/**
 * The search group: one field, one action, and the handful of names people
 * actually arrive with.
 *
 * It is a real GET form, not a controlled input with a submit handler. That is
 * the whole reason the suggestion row is made of links rather than buttons:
 * a reader with JavaScript disabled, a crawler, or a middle-click still gets
 * to the result page. Nothing about the primary job on this site should depend
 * on a bundle having finished loading.
 */
export function SearchField({
  defaultValue = "",
  suggestions = [],
  id = "pf-search",
  autoFocus = false,
}: {
  defaultValue?: string;
  suggestions?: readonly string[];
  id?: string;
  autoFocus?: boolean;
}) {
  return (
    <>
      <Form method="get" action="/search" className="pf-search" role="search">
        <label htmlFor={id} className="sr-only">
          Search fragrances by name or house
        </label>
        <input
          id={id}
          name="q"
          type="search"
          className="pf-search__field"
          placeholder="Search a fragrance or a house…"
          defaultValue={defaultValue}
          autoFocus={autoFocus}
          autoComplete="off"
          enterKeyHint="search"
        />
        <button type="submit" className="pf-search__submit">
          Search
        </button>
      </Form>

      {suggestions.length > 0 && (
        <div className="pf-suggest">
          <span className="pf-meta">Popular</span>
          {suggestions.map((term) => (
            <Link key={term} to={`/search?q=${encodeURIComponent(term)}`} className="pf-suggest__chip">
              {term}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
