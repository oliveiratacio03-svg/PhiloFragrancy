# Visual Design Contract

`AGENTS.md` is the canonical statement of the blank-canvas rule — check
`app/routes/_index.tsx` and `app/global.css`, preserve any real UI/brand
already there, and only treat the canvas as blank when those files still show
the starter's placeholder. This file does not restate that rule; it records
**this app's** visual direction. The fields below are the source of truth for
that direction: once filled in, read and preserve them on every build; while
they are still empty, the first substantial UI pass fills them in.

## Non-negotiable: impress by default

When this app is still a blank canvas, every app generated from this template
must look **spectacular on first load**, even when the build prompt gives no
design direction. "Looks like a clean, intentional product" is the floor, not
the goal. When no direction is supplied, you still commit to one — do not
default to safe gray SaaS:

- Commit to one concrete visual world (see the `frontend-design` skill and its
  `references/visual-direction.md`). Do not ship the neutral placeholder theme.
- Choose a product-fitting accent family and set it in the `app/global.css`
  tokens for **both** light and dark. Never leave the 0%-saturation default as
  the shipped palette.
- Establish a clear type hierarchy, a consistent spacing rhythm, and one
  signature detail (a considered empty state, a distinctive header, a crafted
  primary action) that makes the surface feel designed for its domain.
- Get focus, hover, empty, loading, and dark-mode states right — that polish is
  the difference between an AI demo and a product.

Pick a direction and execute it fully; never average toward generic SaaS. Once
a direction is established and recorded below, preserve and extend it rather
than starting over unless otherwise directed to.

## Fill in before building the first surface

Once the fields below are filled in, they describe this app's established
visual direction — read and preserve them on every subsequent build; do not
re-derive a new direction. The first UI pass must fill these fields in as
part of that build, not leave them as an empty template.

- Product mode: `persuade`
- Audience and cadence: fragrance collectors and first-time luxury buyers, arriving
  from search or ads to check a coupon code or read one honest wear-test. They read a
  page, compare a price, and click out to a retailer.
- Visual world (name + the feeling it creates): *dark editorial still-life* — a
  near-black room, one antique-gold light source, a single piece of artwork per
  screen. Quiet, confident, unhurried; the opposite of a coupon-blog bargain bin.
- Palette family + neutral undertone: warm-neutral dark ground (`#070707`, surfaces
  `#0b0b0c`) with a single antique-gold accent (`#d4af37`, solid `#c6a45c`) and one
  ivory counterpoint band (`#f5f2eb`). Neutrals carry a slight warm cast; nothing is
  a pure grey-blue.
- Type treatment: Cormorant Garamond for all display and headings (large, light,
  generous leading); the wordmark is uppercase with wide tracking and its second half
  in gold italic. Inter for labels, meta, and controls — small, uppercase, tracked
  `0.14em–0.2em`. Prose is Inter at 1rem/1.8.
- Composition: one full-bleed artwork hero, then wide `1320px` containers (prose
  narrows to `760px`) on a single vertical rhythm. Sections separate with `1px`
  hairlines instead of boxes. Link lists are hairline rows, not cards.
- Shape language: square corners everywhere, no radii, no drop shadows, no glow.
  Depth comes from spacing and hairline borders only.
- Anti-references (defaults this app must not drift toward): gold `box-shadow` glow,
  elevated or floating cards, rounded pill chips, decorative SVG or emoji icons
  (`★ ⚠ ✓ •`), numbered section eyebrows (`01 —`), a repeated CTA inside every card,
  and multi-layer gradient vignettes over the hero artwork.

## Change log

- **Homepage clarity pass (2026-09-25):** section order and messaging reworked for
  discovery → offers → comparison, without touching the visual language. Added
  `Compare before you buy`, `Featured editorial reviews`, and a reworded
  `How we evaluate fragrances` that makes no personal-testing claim. Card
  hierarchy is now fragrance-first, offer-second. Product copy, prices, discounts
  and offers are read only from `app/data/coupons.ts` through the `offersFor`,
  `couponFor` and `tagsFor` mappers in `app/routes/_index.tsx` — swap those for
  database queries when the catalog moves server-side. Products without
  photography render a neutral `pf-packshot-empty` placeholder instead of a
  colour block.
- **Minimalist pass (2026-09-25):** ornament removed site-wide — glow, shadows,
  radii, decorative icons, section numbering, and per-card CTAs. Palette, artwork,
  wordmark, and type choices are unchanged. The shared `.pf-*` classes in
  `app/global.css` are the surface for this system; new UI should use them instead
  of inline style objects.
- **Search-first homepage (2026-09-27):** the hero is now a search field, not a
  wordmark. Venus moved from full-bleed background to a contained panel beside the
  field, and is hidden below `md` — it is the heaviest asset on the page and it
  does not help anyone find a fragrance. New surfaces: `.pf-search`, `.pf-deal`,
  `.pf-table`, `.pf-steps`, `.pf-faq`, `.pf-wish`, `.pf-sample`. Two routes added,
  `/search` and `/compare/:slug`, so the homepage has no link to a 404.
  Two things were deliberately **not** built, and the reasons are the point:
  - *No scroll-reveal fade.* It is the signature motion of a coupon aggregator,
    and this brand should not borrow it. Every animation left is a state change
    the reader caused — a hover, a disclosure, a price landing.
  - *No coupon box.* This site issues no discount codes. A "reveal code" button
    that copies a string no retailer honours is a broken promise with a green
    flash on it. The card carries a plainly labelled affiliate link instead.
- **Honesty pass (2026-09-27):** claims that no process produced were removed
  from the product page and its structured data — the `aggregateRating`
  (`reviewCount: 18420`, invented), the `Review` node attributed to
  "PhiloFragrancy Editorial Panel" wrapping first-hand wear-test prose nobody
  wrote, an `Offer` with a made-up price, a "verified today" stamp, a
  `daysLeft = 28` countdown, and a 100% authenticity guarantee. Fabricated review
  markup is a manual-action trigger under Google's structured data policy, so
  this was a risk to the domain's rich results, not a white-SEO tradeoff.
  `Product` now carries no rating, price or stock claim, and `BreadcrumbList` is
  the only node that was always true.
- **Sample pricing is one switch (2026-09-27):** every price, discount and demand
  figure lives in `app/data/deals.ts` behind `PRICING_IS_SAMPLE`. The UI labels
  those rows "Example pricing" and the label disappears on its own when real
  checked data replaces the file. Money is in minor units, matching
  `retailer_offers.price_cents`. A row claims a saving only when two stores have
  a number; with one price there is nothing to save against.
- **Public routes (2026-09-27):** the dev server put a sign-in wall in front of
  every page, so nothing was reachable by a visitor or a crawler. Fixed in two
  places, and both are needed — the server guard (`publicPaths` in
  `server/plugins/auth.ts`) and the client gate (`isPublicPath` on `AppProviders`
  in `app/root.tsx`). Miss the second and the server serves the route while the
  browser bounces the reader to `/sign-in` after hydration. Enabling
  `isPublicPath` drops the `<ClientOnly>` wrapper so public routes SSR, which put
  `DbSyncSetup` back on the server render path; it renders `null`, so it is now
  mounted client-only via `useIsClient`.
- **Comparison page (2026-09-27):** `/compare/:slug` rebuilt as the conversion
  surface — breadcrumb and packshot, one card per retailer with a "lowest
  listed" marker, the review, pros/cons, the verdict, the note pyramid, matched
  similar fragrances, a per-fragrance FAQ, and a closing affiliate block. Two
  structural decisions worth keeping:
  - *Similar is scored, not tagged.* `similarTo()` ranks on shared scent-family
    words and shared notes, weighted 2:1, and drops anything scoring zero rather
    than padding the row. The original request asked for a query on a `tags`
    array; no such array exists, and inventing one to match it would mean
    shipping a field nobody derived from anything.
  - *One price answer, not eight.* The "is it worth it" FAQ is written once in
    the route and shared, because eight copies would be eight chances for the
    wording to drift into something we cannot support.
  - `pathForSlug()` is the one seam that decides where a card goes: a fragrance
    with listed offers opens the comparison page, one without opens the review.
    A card click implies "where do I buy this", and sending a shopper to a page
    with no prices answers nothing.
- **Dev note — data modules do not hot-reload (2026-09-27):** editing
  `app/data/*.ts` does not invalidate the Vite SSR module graph when no route
  module changes alongside it. New exports arrive as `undefined` and the route
  throws `X is not a function` while `tsc` stays clean and the Vite log shows
  nothing wrong. The tell is that the log contains an HMR line for
  `app/routes/*` and none for the data file. Restart `pnpm dev` after editing a
  data module. The same applies to `server/plugins/*.ts`, which is why changing
  `auth.ts` appeared to have no effect.
- **Batch pricing pipeline (2026-09-27):** `batch-update-coupons.js` reads a
  hand-filled `batch-updates.json` and splits the work by data kind, which is the
  rule the schema is built on:
  - *images* rewrite `coupons.ts`, guarded hard. The slug must exist, the
    `image:` line must be found exactly once inside that slug's object, and the
    file is scoped to the block so a bare `image:` elsewhere cannot match. Any
    deviation aborts the run with the file untouched — a half-applied image
    batch is worse than none.
  - *prices* go to a generated `app/data/pricing.json` that `deals.ts` reads.
    Never into `coupons.ts`. A script that scraped prices into the prose file
    would quietly undo the editorial/retailer separation the whole schema
    encodes.
  `PREENCHER` is a guard, not a value: the script refuses to run while any
  placeholder is present, and lists every one of them at once. A batch that
  ships the literal string `PREENCHER` into a price field is worse than a batch
  that does not run. Currency is mandatory — a number without a currency is not
  a price.
- **Price disclosure has three states, not one (2026-09-27):** `SampleNote` reads
  `recordedOnSummary()` and distinguishes nothing-recorded, some-recorded and
  all-recorded. The mixed case is the one that matters: printing a blanket
  "example pricing" understates the prices that were hand-recorded, and printing
  "updated on X" overstates the ones that were not. Both mislead, in opposite
  directions. `recordedOn: null` must render as "date not recorded", never as
  "last updated" — a date nobody wrote down is worse than no date, because a
  reader treats a date as a promise that someone looked.

## Agent-native is structural, not visual

This shell already meets the Agent-Native contract: data in SQL, actions as the
single source of truth, application state for navigation/selection, and
real-time sync. **Chat and the agent rail are opt-in, not default.** Build the
product UI first. Add an `AgentSidebar`, a full-page chat route, or
`sendToAgentChat` handoffs only when the user asks for agent interaction — and
when you do, follow `agent-native-toolkit` and `frontend-design` → Agent
Surface And Page Boundaries so the surfaces are wired correctly.

## Guardrails

- Keep semantic token names and shared component seams intact; express the
  direction through token *values*, type, spacing, and composition — not by
  forking the design system.
- Density comes from data, not prose. Subtract explanatory chrome; never
  subtract the visual craft that makes the app impressive.
- Compare against real products in the chosen mode, not against the starter.
