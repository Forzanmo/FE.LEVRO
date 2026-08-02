---
target: the marketing landing page
total_score: 25
p0_count: 0
p1_count: 3
timestamp: 2026-08-02T15-16-02Z
slug: src-app-page-tsx
---
Method: dual-agent (A: a3b19ef8b91bd9575 · B: a97ac345f6360d3a0)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | The deck progress bar renders at ≥768px parked at 100% — an indicator reporting a state that does not exist |
| 2 | Match System / Real World | 3 | "Evidence-driven, never overwhelming. Each screen has one clear goal" is the design team talking to itself |
| 3 | User Control and Freedom | 3 | Sticky header, real sheet, working anchors; no back-to-top on a 5,900px page |
| 4 | Consistency and Standards | 2 | Five CTA labels, one URL; two "committed brand surfaces" render as two different navies |
| 5 | Error Prevention | 3 | The "Example" chip is right; "Get started" still implies registration and lands on a screen titled Sign in |
| 6 | Recognition Rather Than Recall | 3 | Panel teaches the verdict vocabulary before step 2 uses it; the trust band's link is styled like its three inert neighbours |
| 7 | Flexibility and Efficiency | 2 | One door for every visitor — no pricing, FAQ, demo, or way to see anything without an account |
| 8 | Aesthetic and Minimalist Design | 3 | Real restraint (442 words, 14 teal elements), undone by ~600px of empty white under the sticky features heading |
| 9 | Error Recovery | 2 | No objection handling. The panel says "Not shown" and the page never says what Levvro does about it |
| 10 | Help and Documentation | 2 | Never says how long the conversation takes, what it asks, or what "free to start" stops covering |
| **Total** | | **25/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict

**Not slop, but not memorable.** It clears the "an AI made that" bar on about four decisions and fails the inverse test on everything else.

- *First-order*: navy+teal is the second-most-predictable palette in this category (there is a competitor literally named Teal). DESIGN.md spends four named rules defending it and none argues it is surprising.
- *Second-order*: feed a designer the anti-reference list plus "Linear/Notion craft" and the space collapses to exactly one lane — drenched navy hero, white card floating right, fine texture instead of blobs, geometric display, three-step rail, mist band of ticks, hairline `<dl>`, gradient CTA band, three-column footer. That is this page, in order, with nothing left over.
- *Inverse test*: "A calm, deep-navy hero with a floating white product card, a three-step how-it-works rail, a row of checkmarked promises, a restrained hairline feature list, and a gradient CTA band — restraint over hype, evidence over noise." That sentence fits the modal B2B landing page in 2026 exactly. By brand.md's rule the response is restart, not polish.

What saves it: the panel quotes an actual CV line instead of asserting a score; the worked example is a marketing coordinator, not a React developer; the meter is segmented because the quantity is discrete; and three content sections take three genuinely different shapes. A generator does not make those calls.

What still reads generated: section counts are the defaults (3 steps, 4 promises, 4 features); ~2,900px between hero and CTA contains zero visual events; six sections rise-on-scroll via `motion/react`, which brand.md names as the lazy version of entrance motion.

**Deterministic scan.** Source clean on all three targets (exit 0). A seeded positive control returned **15 findings** across `bounce-easing`, `ai-color-palette`, `gradient-text`, `design-system-color` and more — including the design-system rules, confirming the scanner loads DESIGN.md. The clean results are genuine. Rendered HTML: 1 advisory (`em-dash-overuse`, 9).

In-browser engine, 10 findings. Six are false positives verified by measurement:

| Rule | Verdict |
|---|---|
| `low-contrast` white-on-white h1 | **FP.** Nearest painted ancestor is `rgb(11,37,64)`; true ratio **15.52:1**. Detector failed to resolve `lab()` and defaulted to white. |
| `gradient-text` | **FP.** Zero elements compute `background-clip: text`. Dead CSS in the bundle. |
| `layout-transition` | **FP.** Zero elements have a height/width transition computed. Dead CSS. |
| `cramped-padding` | **FP.** `h-12` flex-centred; 12px effective per side. The rule measures padding only. |
| `shape-assembled-illustration` ×2 | **FP.** Aggregates all inline SVG. |
| `text-occlusion` ×2 | **FP, transient.** Fires only inside the 2.9s resolve window; by t=3.9s both read `ON_TOP`. |
| `heading-rhythm` ×3 | **Real.** The `<dl>` h3s sit 28px below their predecessor and 53px above their own body. |
| `em-dash-overuse` | **Real, advisory.** 9 in rendered body copy. |

**Objective measurements.** CLS **0** at both viewports. Steady FPS **61**. One long task (83ms/93ms). Horizontal overflow **0** at all eight breakpoints (320→1440). DOM 681 elements, zero `<img>`. Heading sequence `h1→h2→h3×3→h2→h3×4→h2` with no skips. Three infinite animations, all compositor-safe.

One measurement to discount: B reports 48 "painted teal" elements including 38 `ellipse`, 32 `line` and 22 `g` tags. This page's markup contains no such elements — that is the TanStack Query devtools logo, i.e. dev-only contamination. A's independent count of **14** matches a prior direct measurement and is the one to trust.

**Visual overlays.** No user-visible overlay is available. Cross-origin injection was blocked by the app's own CSP (`script-src 'self'`, verbatim console error captured); the engine ran in a `bypassCSP` automation context and the live server was stopped (port refuses connections, PID gone).

## Overall Impression

The page's craft floor is high and provably so — CLS 0, 61fps, no overflow at any breakpoint, accent discipline that survives contact with a marketing surface. But this run is *lower* than the last one, and that is the correct result: three new defects shipped in the two most recent commits, one of them visible on every desktop viewport. The biggest opportunity is unchanged and is not visual — the page never answers how long the conversation takes, what it asks, or what "free to start" stops covering.

## What's Working

1. **The assessment panel is the only element doing real argumentative work.** `"Owned the weekly performance report for six campaigns" — Experience, line 2` is the product thesis rendered as evidence rather than claim, on the first screen. The 11-notch meter reconciles with the "7 / 11" above it, so a sceptic who counts is rewarded rather than caught out. The category norm is a "94% match" dial; this is deliberately the inverse.
2. **Colour discipline is real and measured.** 14 teal-bearing elements on the entire page: two wordmark `o`s, seven meter segments, two dots, two chips, one pending dot. Zero teal buttons, zero teal icons, navy ticks in the trust band. A design system's scarcity rule surviving contact with the marketing page is rare.
3. **Section form is chosen by content type.** A sequence gets an ordered rail; parallel statements get a band with no boxes; parallel capabilities get a hairline `<dl>` with a sticky heading. Three shapes for three structures, where stacking icon-card grids is what makes a page read as generated.

## Priority Issues

### [P1] A 2px rule slices under the three steps at every desktop width — a regression from the last commit
- **Why it matters**: `.deck-progress` is set `display: block` inside `@supports` in unlayered CSS; `md:hidden` lives in `@layer utilities` and loses the cascade at equal specificity. Verified computed `display: block` with box 680×2 at 768, 920×2 at 1024, 1176×2 at 1440, and `transform: none` — parked at **100%**. It is visible in both themes as a broken border, and it is precisely the failure its own comment claims to have designed against: *"a bar parked at a third would be an indicator that lies."* It ships parked at a full one.
- **Fix**: move the breakpoint inside the CSS — `@supports (…) { @media (max-width: 767px) { .deck-progress { display: block } } }` — and drop `md:hidden` from the markup so the layer war cannot recur.
- **Suggested command**: `/impeccable polish`

### [P1] The two committed brand surfaces are two different navies, lit from opposite corners
- **Why it matters**: hero `bg-brand-surface` measures `lab(13.85 −1.51 −20.45)` with its light at top-right. The CTA `bg-gradient-brand-deep` starts at `lab(29.74 −0.96 −37.30)` — **2.15× the hero's lightness** — with its light at top-left. DESIGN.md's Committed-Surface Rule exists verbatim to stop this: *"three surfaces each having their own was how 'the brand colour' ended up with three different values."* The page's own comment claims the CTA carries "the same layer stack as the hero"; it carries a different colour, a different gradient type and a mirrored light. Removing the teal glow last pass fixed the halo, not the lightness.
- **Fix**: give the CTA band `brand-surface` plus the hero's radial-light layer, and retire `bg-gradient-brand-deep` from this page.
- **Suggested command**: `/impeccable polish`

### [P1] Five CTA labels, one destination — fixed in the sheet, still shipping in the header
- **Why it matters**: `Sign in`, `Get started`, `See what mine proves`, `Start your assessment` and the footer `Sign in` all resolve to `/sign-in`. In the header a ghost "Sign in" and a filled "Get started" sit **8px apart**, presenting new-vs-returning as a choice that does not exist. `mobile-nav.tsx` identifies this exact pattern, explains why it is dishonest, and fixes it — inside the sheet. The desktop header, three lines away in the same file tree, still ships it.
- **Fix**: header keeps one filled action; demote "Sign in" to a text link or fold it into the sheet at all widths. Make the hero primary and the CTA band primary say the same words so a scroller recognises the door rather than counting new ones.
- **Suggested command**: `/impeccable clarify`

### [P2] The hero subhead never got the light-on-dark compensation, and the leading half of that fix is dead everywhere
- **Why it matters**: measured, hero subhead `18px / 27px / letter-spacing normal`; CTA body `18px / 27px / 0.18px`. The subhead uses `className="text-brand-surface-muted"` instead of `tone="onBrand"`, so it receives none of the compensation — the paragraph carrying the product's whole promise is the one that missed it. Separately, both read line-height **27px = 1.5**, not the 1.65 `leading-relaxed` the tone declares: `Text`'s `leading` variant defaults to `normal` and cva emits it after `tone`, so tailwind-merge drops the tone's leading. Half of that fix has never applied anywhere.
- **Fix**: `tone="onBrand"` on the hero subhead with colour set via a modifier; and make the `leading` variant default `undefined` so the tone's value survives.
- **Suggested command**: `/impeccable polish`

### [P2] The section heading out-ranks the hero headline
- **Why it matters**: h1 56px vs h2 48px is a **1.167** step, under the ≥1.25 `heading.tsx`'s own comment claims the marketing scale meets. Optically it is worse than the ratio — 48px near-black ink on near-white carries more weight than 56px white on navy under a texture overlay. In the full-page shot "From uncertain to interviewing, in three steps" is the loudest type on the page.
- **Fix**: take `display-md` to 2.5rem (1.4 step) or push `display-lg` to 4rem.
- **Suggested command**: `/impeccable typeset`

## Persona Red Flags

**Jordan (Confused First-Timer)**: header `Sign in` / `Get started` 8px apart, both → `/sign-in`; "ATS-safe template included" in hero microcopy with the explanation three folds down; *"A short coaching conversation"* with no duration anywhere on the page while deciding whether to start tonight; the panel's fourth row `Paid media strategy — Not shown` left hanging, with the product's answer to a gap never shown.

**Riley (Stress Tester)**: the 2px rule appearing at exactly 768px and never moving; five CTAs, same screen five times; the meter says `7 / 11` and the list shows four rows with nothing saying it is truncated — on the page whose argument is evidence over assertion; a 1216×177 focus ring wrapped around three non-interactive steps; a 487px-wide pointer region over blank footer space.

**Casey (Distracted Mobile)**: the header CTA is **100×32** — the smallest tap target on the phone, beside a 44px hamburger, on the one control the sheet architecture deliberately keeps outside itself; the menu is two links then ~470px of empty white then a button at the very bottom; only the top ~215px of the panel is above the fold at 390×844.

## Minor Observations

- **[P3] Two invisible-affordance defects.** The trust band's third item is the only link among four visually identical statements — same tone, size, no rest-state underline, 24px tall at 390 (exactly the WCAG floor). The footer `Logo` has no width constraint in its grid column: measured **487×36** at 1440, a full-column pointer region over empty space. `w-fit` fixes the second.
- The `<dl>`'s h3s sit 28px below their predecessor and 53px above their own body — each binds to the wrong block (detector `heading-rhythm`, confirmed real).
- `.brand-sheen` runs `infinite`; a highlight sweeps the closing CTA forever, including off-screen.
- The features section's sticky column leaves ~600px of empty white beneath it at 1440, and the `minmax(0,13rem)` `<dt>` opens a ~160px gutter between short titles and their bodies — an unfilled table rather than a specimen list.
- Trust band items 2 and 3 wrap to two lines while 1 and 4 do not; item 4 restates the hero eyebrow verbatim.
- The h1 keeps its full stop; no other heading on the page does.
- `Reveal` pulls `motion/react` onto the landing page for six scroll translates. The page removed a 31KB mono face for eight glyphs and then shipped an animation library for six 18px slides.
- The rendered voice never uses a contraction — *"it always explains why it is asking"*, *"You will see which skills…"*. The standards-document register is winning over the "knowledgeable mentor with genuine warmth" the brief asks for.

**Weakest copy, verbatim**: *"Everything you need to become recruiter-ready"* (textbook filler, the modal section heading in this category) · *"Evidence-driven, never overwhelming. Each screen has one clear goal."* (internal design-doc language on a consumer page).

## Questions to Consider

1. Four of the eight controls above the fold resolve to `/sign-in`. If you deleted "Sign in" from the header and made the hero primary read "Start your assessment", what would you actually lose — and who would notice?
2. The page's argument is "we show our reasoning." The panel's fourth row resolves to `Not shown`, and then nothing. Where is the screen showing what Levvro *does* about a gap — and isn't that more persuasive than the verdict?
3. A competitor could ship the inverse-test sentence by Friday. Name the one element they could not — then ask whether it deserves more than 22rem of a hero column and one appearance in 5,900px of scroll.
4. Nothing tells an anxious, time-pressed reader how long the conversation takes, what it asks, or what "free to start" stops covering. Which of those three, answered above the fold, would move more people than every visual fix in this report combined?
