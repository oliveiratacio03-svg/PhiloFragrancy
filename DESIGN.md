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
