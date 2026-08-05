---
target: the marketing landing page
total_score: 28
p0_count: 0
p1_count: 5
timestamp: 2026-08-02T13-10-38Z
slug: src-app-page-tsx
---
Method: dual-agent (A: a3db80f3daaf22e80 · B: a4baf34eed5778d22)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Mobile step deck gives no signal it scrolls; the "Live" chip indicates status that does not exist |
| 2 | Match System / Real World | 3 | "Evidenced / Thin / Not shown" are read in the panel before step 2 defines them; "ATS-safe" expands 1.5 screens later |
| 3 | User Control and Freedom | 3 | CTA sheen (6s infinite) and chevron drift (16s) cannot be paused; the deck has no prev/next or dots |
| 4 | Consistency and Standards | 2 | Six CTAs resolve to one URL with five different labels; mobile deck is 20px out of alignment with every other element |
| 5 | Error Prevention | 3 | "Create your account" does not create an account; the next screen walks back the promise |
| 6 | Recognition Rather Than Recall | 3 | "Three CV templates — with the trade-offs stated" states that a reason exists without giving one |
| 7 | Flexibility and Efficiency | 3 | Skip link and anchors are right; `tabIndex={0}` adds a desktop tab stop to a region with nothing focusable inside |
| 8 | Aesthetic and Minimalist Design | 3 | CTA band is ~120px of empty navy above and below; mobile sheet is ~1000px of void; rail dangles ~500px past step 3 |
| 9 | Error Recovery | 3 | No error surfaces exist on this page — nothing broken, nothing demonstrated |
| 10 | Help and Documentation | 2 | Nothing anywhere says what happens to the CV; the only support route is a raw mailto in the footer |
| **Total** | | **28/40** | **Good — solid foundation, weak areas are addressable** |

## Anti-Patterns Verdict

**LLM assessment.** It does not read "an AI made that." It does read "a good designer executed the 2026 consensus playbook." It passes the first slop test and fails the second.

- *First-order* (palette from category alone): the page correctly refuses violet, but navy+teal is the second most predictable answer in this exact category — there is a competitor literally named Teal, and Jobscan/Careerflow/Huntr all live in the blue-to-teal band. Dodging the #1 tell by landing on the #2 default is still a default.
- *Second-order* (aesthetic family from category + anti-references): given "AI career tool, must not be AI-SaaS/enterprise/gamified/crypto/cheap-resume-builder, reference is Notion/Linear craft," the derivable output is a near-white surface, one drenched dark hero, geometric display against neo-grotesque body, a product card floating right, three numbered circles on a rule, a checkmark reassurance strip, a hairline spec list, a rounded gradient CTA band, three-column footer. That is this page, in that order.

Genuinely ownable: the chevron field (traced from the mark, cannot be lifted without lifting the logo); the panel's content discipline (real verdicts, a quoted CV line, a segmented meter, and the deliberate absence of a match score); the teal `o` rhyming with the mark's apex.

Well-executed defaults wearing identity costume: the drenched hero + white card; three numbered circles on a rule; the rounded gradient CTA band with an infinite shimmer. The stated north star is "The Standards Document — a well-made technical report," and exactly one of five sections (the `<dl>` spec list) does anything documentary. Elsewhere the north star is a caption on a conventional landing page.

**Deterministic scan.** Static CLI scan of `src/app/page.tsx`, `src/components/marketing/`, and `src/app/globals.css`: **clean (exit 0, zero findings)** on all three. A seeded positive control returned 3 findings, so the scanner is not a silent no-op. Rendered HTML: 1 advisory finding (`em-dash-overuse`, 9 in body text).

In-browser rule engine (14 finding lines across 10 element groups):

| Rule | Verdict |
|---|---|
| `low-contrast` white-on-white on the hero h1 | **False positive.** Pixel-sampled the painted h1 box: dominant `rgb(11,37,64)`, measured **15.52:1**. `body { background: transparent !important }` makes a naive ancestor walk fall through to white `<html>`. |
| `gradient-text` | **False positive.** Zero elements compute `background-clip: text`; grep finds no `bg-clip-text`. |
| `cramped-padding` on "Start your assessment" | **False positive.** `size="xl"` is `h-12` with centered content; vertical padding is 0 by construction. |
| `shape-assembled-illustration` ×2 | **False positive.** Aggregates all inline SVG; the mark itself is 2 paths. |
| `em-dash-overuse` (8 in body copy) | **Real, minor.** Tool marks it advisory. The copy leans hard on the em-dash. |
| `layout-transition` | **Real.** `transition-all` on 5 button elements (`button.tsx:25`) animates layout properties, against the project's own motion rule. |
| `heading-rhythm` ×3 | **Real.** The `<dl>` h3s have 28px above vs 52px below, so each binds visually to the block above it. |
| `radial-spotlight-glow` ×2 | **Partly fair.** These are the hero's directional light and the backdrop pools, not decorative blobs — but the page does still lean on radial gradients while DESIGN.md claims "never a blurred blob." |
| `text-occlusion` ×2 | **By design, state-dependent.** `panel-pending` (opaque white, `inset-0`) genuinely covers the resolved row for 2.9s — that is the intended crossfade, added deliberately to fix an axe contrast failure. Absent once settled. |

**Visual overlays.** No user-visible overlay is available. Cross-origin injection was blocked by the app's own CSP (`script-src 'self'`) — verbatim: *"Loading the script 'http://localhost:8400/detect.js' violates the following Content Security Policy directive."* The rule engine was run instead inside a `bypassCSP` automation context, and the live server has been stopped (port 8400 refuses connections, PID gone).

## Overall Impression

The craft floor is genuinely high — legibility is proven rather than claimed, the page survives with JS dead, and the assessment panel makes the positioning legible in five seconds without a fabricated score. The problem is not execution, it is commitment. The identity work stopped at colour and texture; the *composition* is still the category default, and the page's own named rules are being broken by the page itself. The single biggest opportunity: the product shot is the best thing here and it is currently telling ninety percent of the stated audience that this tool is for software engineers.

## What's Working

1. **The panel refuses to fabricate a score, and the refusal is visible in the form.** Eleven discrete segments rather than a continuous bar means the shape itself says *we counted things* instead of *we computed a number*. With the quoted evidence line and three real verdicts, it is the one element a competitor cannot copy by swapping a hex value.
2. **Legibility discipline is real.** Measured on the composited page: hero subhead ~8:1 on navy, muted body ~5.3:1 on light. And it survives failure — `Reveal` animates transform only, the panel's resolved state is the CSS default with no fill-mode, `hero-stagger` ends visible. Readable on the first server frame with JS dead.
3. **The "What you get" `<dl>` spec list.** Hairlines, sticky heading column, no icons, no boxes. The only section that is not the category default, and the one place the "Standards Document" north star actually arrives.

## Priority Issues

### [P1] The product shot tells most of the stated audience it is not for them
- **Why it matters**: The eyebrow says "For juniors and career shifters"; the panel beside it says `Target role · Frontend Engineer` and lists React, TypeScript, Automated testing, System design. The panel is the artefact that answers "what is this" without being read — and it answers "this is for software engineers." A shifter moving into marketing, ops or teaching reads four engineering skills and leaves. Invisible to the team because they are the sample.
- **Fix**: Re-cast the mock outside tech — `Target role · Marketing Coordinator`, rows like "Campaign reporting" / "Stakeholder communication" / "Budget ownership", evidence line *"Ran the £40k paid-social budget for two quarters" — Experience, line 2*. Nothing else in the component changes.
- **Suggested command**: `/impeccable clarify`

### [P1] Teal appears 14 times before the user has earned anything
- **Why it matters**: Measured 14 elements carrying teal above 1400px: the eyebrow, the wordmark, four trust checkmarks, seven meter segments, two "Evidenced" chips, row dots, the "Live" dot, the CTA glow. DESIGN.md's Teal-Is-Earned Rule says teal means *done* and "its rarity is what makes it read as a win." The eyebrow and the checkmarks are direct violations. Teal is currently the page's second UI colour, not its reward colour — and the design system is about to be frozen with its own named rule already broken on the flagship surface.
- **Fix**: Strip teal from the eyebrow (use `brand-surface-muted`) and the trust checkmarks (neutral or navy). Keep it on the meter, the verdict chips and the wordmark, where it genuinely marks evidence.
- **Suggested command**: `/impeccable quieter`

### [P1] Nothing on the page says what happens to the CV
- **Why it matters**: No privacy statement, no data answer, no "never used for training" above the footer link. The reassurance row spends one of four slots on cost, which the hero microcopy already covers. The fear at the moment of clicking is not money — it is handing a complete employment history to an AI. The page answers a fear nobody has twice, and the real one zero times.
- **Fix**: Replace "Free to start — no credit card" in the trust band with a data-handling promise linked to `/privacy` (only if true). Cost is already stated in the hero.
- **Suggested command**: `/impeccable clarify`

### [P1] Six CTAs, one destination, five labels
- **Why it matters**: Verified — 4 `ROUTES.signIn` in `page.tsx` and 2 in `mobile-nav.tsx`, all resolving to `/sign-in`. In the mobile sheet, "Create your account" sits directly above "Sign in" as a filled/outline pair doing the identical thing. New-vs-returning is the only distinction a first-time visitor cares about, and the page presents it as two buttons that lie about being different. `ROUTES.signUp` exists in `routes.ts` but has no page, so the fix is not simply repointing.
- **Fix**: Either build `/sign-up`, or collapse the sheet to one primary button and make the labels honest about landing on a single combined auth screen.
- **Suggested command**: `/impeccable clarify`

### [P1] The mobile step deck is 20px out of alignment and the "1" badge touches the screen edge
- **Why it matters**: Verified at 390px — `h2` at `x: 20`, first `li` at `x: 0`, badge rect `{x: 0, width: 46}`, `ol.scrollLeft: 20` on load. It is the first screen after the hero, and the page's single left edge — its strongest grouping cue — visibly breaks. It reads as a rendering glitch, which on a trust-driven product is expensive.
- **Fix**: `snap-start` snaps the first item to the scroll container's padding-box edge, cancelling `px-5`. Add `scroll-pl-5 md:scroll-pl-0` to the `<ol>`, which the snapport does respect.
- **Suggested command**: `/impeccable adapt`

## Persona Red Flags

**Jordan (Confused First-Timer)**: The three verdict chips are among the first words he reads; step 2 defines them below the fold. "ATS-safe template included" expands ~1.5 screens later. The sheet's "Create your account" lands on a screen titled *Sign in*. "See what mine proves" has no noun — scanned button-first it does not say what he is about to do. "Three CV templates — with the trade-offs stated" tells him a reason exists and shows none, on the page selling shown reasoning.

**Riley (Deliberate Stress Tester)**: "Sign in" and "Get started" adjacent in the header, differently weighted, identical href — ten seconds to find. A `pending-pulse … infinite` "Live" dot on a hard-coded `7 / 11`. The entire panel is fabricated and carries no "example" marker anywhere — DESIGN.md is proud it does not fake a *score*; it fakes a whole assessment and does not say so. "Every verdict shows its reasoning" against step 1's "no judgment" — *verdict* is a courtroom word on a page selling non-judgment.

**Casey (Distracted Mobile User)**: At 390×844 the panel starts at ~607px, so its first verdict row is below the fold — Casey's entire five-second impression is text and the artefact carrying the pitch never enters it. The deck glitch above. Two stacked full-width 48px buttons of equal mass. The mobile menu is ~1000px of empty white between two links at top and two buttons at bottom — it looks like a page that failed to load. `chevron-drift` is correctly off below 768px, which leaves mobile with no motion at all except a 2.9s panel resolve that completes long before Casey scrolls to it.

## Minor Observations

- **[P2] The composition inverts twice.** Dark: the committed hero `#0b2540` on a `#0a131e` page is a ~4% lightness step, so the one drenched fold reads as a faint rectangle while the CTA band with its teal glow is the brightest object on the page — the closing CTA out-shouts the opening promise. Responsive: measured column widths are 416/480 at 1024 and 512/480 at 1120 — the product shot is **wider than the headline column** on a common laptop width, and the h1 hits its 56px maximum at 1024, setting 56px type in a 416px measure across 3 lines.
- The desktop rail runs ~500px past step 3's circle with nothing on it — it implies a fourth step.
- The hero's secondary CTA has zero affordance on desktop: `sm:ring-0` strips the border, leaving white text with 257px of gap from the primary. It reads as a caption.
- The two committed brand surfaces are lit from opposite directions — the hero from upper right, the CTA band from lower left. The hero's own comment says "one source, one direction."
- Hero headline and CTA headline are the same sentence twice: "Know exactly what your CV proves." / "Find out what your CV proves." The end of a peak-end page introduces no new emotional content.
- `shadow-brand-glow` (teal halo) around the CTA band on near-black is the page's one glow-on-black moment — mild, but it is the design system's own crypto/neon *Don't* applied to itself.
- `mobile-nav.tsx` claims "This is the page's only client component." Verified false — `Reveal` is `'use client'`, imports `motion/react`, and is used 14 times on this page. DESIGN.md removed Geist Mono from this exact page over 31KB for eight glyphs; Motion is larger and buys six 18px translates that the existing CSS `hero-rise` keyframe already performs for free.
- The back-sheet behind the panel is a featureless white rectangle. The comment calls it "the CV peeking out"; with no content it reads as a duplicate card or a shadow bug.
- Step 1's best line — "No forms, no guessing, no judgment." — is the least prominent copy in its own section: muted grey, below the fold, inside a horizontal scroller.
- `heading-rhythm`: the `<dl>` h3s sit 28px below their predecessor and 52px above their own body, so each binds to the wrong block.
- `transition-all` on button variants animates layout properties, against the project's own motion rule.
- No horizontal overflow at 320px; `prefers-reduced-motion` honoured globally; heading structure has no level skips (1,2,3,3,3,2,3,3,3,3,2); all touch targets clear 24px.

## Questions to Consider

1. The north star is "a well-made technical report." Name one thing on this page that a report does and a landing page does not. The `<dl>` is the only candidate — is the concept real, or a caption written over a conventional SaaS page after the fact?
2. If the panel showed a teaching assistant's CV instead of a frontend engineer's, would you still believe the eyebrow that says "For juniors and career shifters"? Which of the two is lying?
3. Teal appears fourteen times before a visitor has earned anything. When they finally do evidence their first skill, what is left for that colour to feel like?
4. The panel is a fabricated assessment of a fabricated person, quoting a line from a CV that does not exist, with no marker saying so — on the page whose thesis is evidence over assertion. Where is the evidence for the evidence?
