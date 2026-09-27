import { createAuthPlugin } from "@agent-native/core/server";

/**
 * The public catalogue.
 *
 * Without this list every page route redirects anonymous visitors to
 * /sign-in. For a site whose entire job is being found and read by strangers,
 * that meant the homepage, the search results, the comparison pages and the
 * reviews were all unreachable — and unindexable.
 *
 * `"/"` is safe to list. The framework matches with
 * `path === normalized || path.startsWith(normalized + "/")`, so a bare slash
 * normalises to "/" and then only ever matches the root itself: "//" is not a
 * prefix any real request begins with. Framework and API routes
 * (`/_agent-native/*`, `/api/*`) therefore stay protected.
 *
 * The rest are prefixes, so `/perfumes` covers `/perfumes/creed-aventus` and
 * `/compare` covers `/compare/:slug` without listing every slug.
 *
 * If you add a route later and it starts redirecting signed-out visitors to
 * /sign-in, that route is the thing to add — not a blanket publicPaths entry.
 */
export default createAuthPlugin({
  rootAuth: false,
  publicPaths: ["/", "/search", "/compare", "/perfumes", "/about", "/disclosure"],
});
