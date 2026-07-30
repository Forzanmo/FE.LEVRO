---
target: landing, sign-in, coach, dashboard + type/color/background systems
total_score: 22
p0_count: 2
p1_count: 4
timestamp: 2026-07-29T15-22-56Z
slug: n-in-coach-dashboard-type-color-background-systems
---
Method: dual-agent (A: design review `a528510f3db942f44` · B: detector + Storybook `a1b59e788595337cc`)

Target: landing (`/`), sign-in, coach, dashboard, plus the typography, colour and backdrop systems.
Evidence path: bundled `detect.mjs` + Storybook (user-selected). No full-page render — see Coverage Gaps.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | "Save & exit" (`coach-view.tsx:59`) persists nothing; `auth-guard.tsx:27` returns `null` mid-redirect (blank screen, no announcement); `processing-screen.tsx:50` has no `aria-live`. |
| 2 | Match System / Real World | 3 | Copy is plain and honest, but `coach-service.ts:65-72` hardcodes six software-engineering skills for an audience PRODUCT.md defines as career shifters. |
| 3 | User Control and Freedom | 2 | Back/Skip/Edit in the coach are genuinely good — but no persistence, no exit confirmation, and `useCoach.restart` (`use-coach.ts:110`) is implemented and never wired. |
| 4 | Consistency and Standards | 2 | Two vocabularies for one single-select (native radios `option-group.tsx:50` vs `aria-pressed` toggles `onboarding-view.tsx:80`). Gradient and default buttons are near-identical in light and invert polarity in dark. `border-2` violates the project's own Hairline Rule. |
| 5 | Error Prevention | 2 | No guard on abandoning the assessment. `coach-composer.tsx:102,130` disable Continue/Send without saying what's missing. Sign-in has no failure path. |
| 6 | Recognition Rather Than Recall | 3 | Transcript history and per-category reasoning are strong; `use-coach.ts:54` `EDIT` rewinds `index` so `coach-view.tsx:49` `slice(0, index)` erases later answers from the transcript. |
| 7 | Flexibility and Efficiency | 2 | ~12s of manufactured delay in the core flow (750ms × 8 in `use-coach.ts:26`, plus 6000ms in `processing-screen.tsx:20`). Only escape is `prefers-reduced-motion`. |
| 8 | Aesthetic and Minimalist Design | 2 | The same 5-day streak renders twice in one dashboard viewport in identical amber pills (`dashboard-view.tsx:50`, `activity-heatmap-card.tsx:32`). |
| 9 | Error Recovery | 2 | `dashboard-view.tsx:69` is excellent ("your progress is safe") — and is the only error state across all four surfaces. |
| 10 | Help and Documentation | 2 | "Why I'm asking" (`coach-message.tsx:49-77`) is a real strength, but nothing explains what the score means, how it is computed, or what XP/quests/missions are. |
| **Total** | | **22/40** | **Acceptable (low end) — significant improvements needed** |

## Anti-Patterns Verdict

**Does this look AI-generated? Not by palette. Yes by composition.**

**LLM assessment.** Every *named* ban holds, and that was verified rather than assumed: zero `background-clip: text` outside a scrollbar `content-box`; zero indigo/violet/fuchsia anywhere in `tokens.ts`; `backdrop-blur` confined to legitimate sticky chrome; no side-stripe accents (`todays-mission-card.tsx:18` is a 2px *top* rule, a different move); "Step 1/2/3" at `page.tsx:41-58` labels a genuinely ordered sequence, not scaffolding.

The failure is one level up, at the reflex test:

- **`aurora-backdrop.tsx:53-118` is the banned gradient-blob composition, executed in teal.** A full-viewport 55%-opacity wash, three 42–46rem blurred radial blobs drifting on 28/34/40s loops, a WebGL `MeshGradient`, and a dot grid. Swap `MESH_COLORS` (`aurora-backdrop.tsx:10`) for violet and it is indistinguishable from the thing PRODUCT.md:71 bans by name.
- **Three consecutive icon-grid rows on one page**: `page.tsx:226-251`, `269-290`, `294-305`. The bento attempt at `page.tsx:228` only applies `lg:col-span-2`, so at `sm:grid-cols-2` it degrades to four identical cards.
- **Hero-metric template** at `applications-card.tsx:33-46` — three big `text-3xl tabular-nums` figures with `divide-x` rules and tiny labels. Repeated at `pipeline-summary.tsx:27`.
- **Landing composition is beat-for-beat the default**: fixed gradient aurora → pill badge with sparkle → h1 with exactly one colour-highlighted span → two-button row → "Free to start · No credit card required" microline → product-preview card → feature grid → 3-step how-it-works → rounded gradient CTA band with animated sheen.

**Category-reflex check, both altitudes.** First-order, on hue: passed deliberately — `tokens.ts:22-26` argues the teal choice explicitly. Second-order: **failed, and the code proves it.** "Not purple → teal" is the single most-taken escape hatch, and the two-colour identity that would have differentiated it is not real. Gold appears as a discrete UI colour in exactly **two** places, both on Roadmap (`quest-node.tsx:71`, `quest-tree.tsx:49`). On all four target surfaces gold exists only *inside* gradients. Where gold-semantics are genuinely needed — streaks, XP — the app reaches for the `warning` token instead (`dashboard-view.tsx:50`, `activity-heatmap-card.tsx:32`, `todays-mission-card.tsx:47`). This is a one-colour identity with a warm gradient edge, and the one colour is the obvious non-purple.

**Deterministic scan.** `detect.mjs` over 9 target paths: **exit 2, 2 findings**, both `design-system-font-size` advisories — `bottom-nav.tsx:29` (`text-[0.7rem]`) and `icon.stories.tsx:46` (`text-[0.6rem]`). The first is a true positive on shipped UI and converges with an independent finding that the same component clips (see Minor Observations). The second is a Storybook-only dev gallery label — a true detection but a false positive for a product critique. Nothing is being suppressed: no `.impeccable/config.json`, and `config.local.json` holds only `hook.consent`.

**Treat that near-clean result as low signal, not as evidence of health.** The scan missed both of the worst defects in the codebase — an invalid colour token that blanks 15 surfaces in dark mode, and an icon variant that mangles most of the primary navigation. Both were found by rendering, not by reading.

**Visual overlays: none.** `claude-in-chrome` reported the extension is not set up, so no script injection and no user-visible overlay exists. Assessment B fell back to Playwright (chromium 149) driving Storybook's `iframe.html` directly: **62 screenshots across 16 stories, light and dark, at 1280×900 and 390×844. Zero render errors, zero console errors.** Storybook was started in the background and confirmed stopped (port 6006 free, no orphan processes).

## Overall Impression

The systems layer here is better than most shipping products, and the surface layer is where it comes apart.

`tokens.ts` is a genuine single source of truth with a build-time contrast gate, and the token-on-token numbers are excellent — `muted-foreground` at **7.42:1** light and **7.38:1** dark, placeholders at **7.73:1**. `text.tsx:30-31` refuses opacity-based muting *on purpose*, with the reason written down. `globals.css:113-118` documents why a second gradient exists (the teal→gold ramp fails WCAG under white glyphs). That is engineering-grade design rationale, and it is rare.

But every serious failure in this report lives at a boundary that gate never tests: text over the backdrop, glyphs over the gradient, a colour function fed the wrong colour space, an icon variant fed a stroke-based icon set. The design system is provably correct about pairs it was asked about and silently wrong everywhere else.

**The single biggest opportunity:** the most expensive visual system in the codebase (a four-layer WebGL aurora) is spent on a marketing backdrop where it breaks contrast on the reassurance copy, while the product's most emotional moment — a first-time job-seeker seeing their Career Score — has no visual treatment at all. The score simply appears inside the second card of a six-card grid. Invert that allocation and two P0s resolve at once.

## What's Working

**1. The contrast discipline is real, and it is documented.** `muted-foreground` at 7.42:1 / 7.38:1 and placeholder text at 7.73:1 beat most products' *body* text. More importantly, `text.tsx:30-31` explicitly rejects opacity-based muting to hold AA, and `stat-card.tsx:9-12` cites SC 1.4.11 by number. That is discipline you cannot fake, and it is why the composite failures below are worth fixing rather than symptomatic of a careless codebase.

**2. The coach's answer architecture is the best-engineered thing here.** `option-group.tsx:50-57` builds on native `radio`/`checkbox`, so roving arrow keys and screen-reader semantics come free instead of being reimplemented badly. `coach-composer.tsx:38-44` prefills from props and is keyed by question id, so remount handles reset with no sync effect. Edit is a real persistent button (`user-answer.tsx:29-37`), not a hover-only affordance. `coach-message.tsx:64-75` expands reasoning via `grid-rows-[0fr]→[1fr]` — no height animation, no layout thrash. Rendered confirmation: radio exclusivity verified, expanded disclosure captured correctly in both themes.

**3. Honest marketing in a category that fakes proof.** `page.tsx:61` — *"Honest promises about the product — not fabricated testimonials or outcome stats"* — and the array delivers. No invented user counts, no fake logos, no "87% land interviews". Shipping a conversion page with zero fabricated social proof is a deliberate trust choice that serves PRODUCT.md's evidence-over-assertion principle better than any feature.

## Priority Issues

### [P0] Hero and reassurance copy fail WCAG AA over the aurora backdrop, in both themes

`aurora-backdrop.tsx:53-63` paints a fixed full-viewport wash at 55% of `--gradient-from`, then `:66-89` stacks three radial glows at 45/40/35% light and 60/55/50% dark. `globals.css:96-98` forces the body transparent, so all hero text composites directly onto this.

| Element | file:line | Required | Light | Dark |
|---|---|---|---|---|
| Subhead body | `page.tsx:182` | 4.5:1 | **2.93:1** | **1.92:1** |
| "interviews" span | `page.tsx:185` | 4.5:1 | **2.38:1** | 3.28:1 |
| H1 brand span | `page.tsx:176` | 3.0:1 | **2.38:1** | 3.28:1 |
| "Free to start" | `page.tsx:204` | 4.5:1 | **3.49:1** | **2.65:1** |
| Hero badge | `page.tsx:169` | 4.5:1 | **2.84:1** | — |
| CTA heading (`tone="inverse"`) | `page.tsx:315` | 3.0:1 | 6.29:1 | **3.16 → 1.77:1** |
| Logo glyph on `bg-gradient-brand` | `logo.tsx:25` | 3.0:1 | **2.00:1** | **1.75:1** |

**Why it matters.** DESIGN.md:130 claims *"Every palette value passes a WCAG-AA contrast gate at build time — the design is provably legible in both light and dark before it ships."* The gate tests token **pairs**; it has never tested a token against the rendered backdrop. The claim is false on the two surfaces every user sees first, and the specific casualties are the reassurance copy — the sentences written to calm an anxious first-timer are the least readable pixels on the page. `logo.tsx:25` is especially telling: it commits the exact failure that `globals.css:113-116` was written to prevent.

**Fix.** Cap the wash at ~18% and the glows at ~0.15/0.20, which brings the subhead above 4.5:1 while keeping the surface non-flat. Extend the gate in `scripts/build-tokens.mts` to composite `--gradient-from/via/to` at shipped alphas over `--background` and assert `foreground`, `muted-foreground`, `brand` and `ring` against the result. Stop using `text-brand` for inline emphasis over the backdrop (`page.tsx:176,185`) — DESIGN.md:300 already says emphasise with weight. Replace `tone="inverse"` at `page.tsx:315` with explicit `text-white`, and switch `logo.tsx:25` to `bg-gradient-brand-deep`.

**Suggested command:** `/impeccable audit`

### [P0] "Save & exit" silently destroys the entire assessment

`coach-view.tsx:58-60` renders a button labelled **"Save & exit"** linking to the dashboard. `use-coach.ts:85` holds `{index, answers, phase}` in a bare `useReducer` — no localStorage write, no service call, no `beforeunload` guard. Navigating away discards every answer.

**Why it matters.** This is the most damaging trust break in the product. PRODUCT.md:22-23 describes users doing this "around a job, studies, or life" — they *will* leave mid-flow, and the button explicitly promises they can. They return to question 1 having lost twenty minutes of honest self-assessment. PRODUCT.md:62 sets the voice as *"never hyping and never hallucinating"*; the UI is doing exactly that about its own behaviour.

**Fix.** Persist `{index, answers}` to localStorage on every dispatch in `use-coach.ts`, mirroring the pattern already proven in `auth-service.ts:45-54`, and rehydrate in the `useReducer` initialiser. Until that ships, relabel `coach-view.tsx:59` to "Exit" and confirm the loss. Wire the already-implemented, already-unused `restart` (`use-coach.ts:110`) to a resume prompt.

**Suggested command:** `/impeccable harden`

### [P1] The signature Career Score ring is inverted — gold rewards low scores

`progress-ring.tsx:52-56` defines the gradient across the SVG bounding box (`x1 0% y1 0%` → `x2 100% y2 100%`), and `:50` rotates the whole element `-rotate-90`. That rotation carries the gradient with it, so in screen space the axis runs bottom-left → top-right: teal at bottom-left, **gold at top-right**. The arc starts at 12 o'clock and sweeps clockwise — straight into the gold end.

Rendered confirmation at three values: **the 24 ring is entirely gold; the 84 ring runs gold → teal.** Arc colour tracks sweep position, not value.

**Why it matters.** DESIGN.md:183 names the Warming-Score Rule: the ring is stroked teal → aqua → gold *"so it reads as progress and warmth — never judging an anxious user."* The implementation delivers the opposite. A user who scores 31 gets the pure "achievement / your moment" colour; a user who scores 84 gets a ring that *cools* as it fills. On the product's hero visualization, the one component the whole design system is built around, the emotional signal is backwards. It also propagates: `processing-screen.tsx:40` renders the same ring at `value={done ? 100 : 72}` under "Building your Career Score…", so an anxious user watches a gold ring fill to 72 and reads 72 as their score — the real one is 68.

**Fix.** Make the gradient follow the arc rather than the box: use `gradientUnits="userSpaceOnUse"` with coordinates chosen so 0% sits at the arc's start (12 o'clock post-rotation) and 100% at its end, or drop `-rotate-90` and start the arc at 12 o'clock in path space so the box gradient and the sweep agree. Then verify at value 10, 50 and 90 that low reads teal and high reaches gold. Separately, stop reusing `ProgressRing` for indeterminate progress at `processing-screen.tsx:40`, or set it to 100 with a different treatment.

**Suggested command:** `/impeccable polish`

### [P1] Two defects erase UI in dark mode and mangle most of the primary navigation

Both were found independently by code review and by rendering.

**(a) `--brand-muted` is an invalid colour in dark.** `tokens.generated.css:218` emits `rgb(NaN NaN NaN / 0.15)` — the only `NaN` in the entire generated CSS. Root cause: `tokens.ts:302` calls `alpha(palette.brand[500], 0.15)`, but `alpha()` (`tokens.ts:197-203`) parses **hex only**, and the brand palette is authored in OKLCH (`tokens.ts:33`) while `success`/`warning`/`info` are hex. Browsers discard the invalid declaration, so **every `bg-brand-muted` surface loses its fill in dark mode** across 15 shipped call sites including `page.tsx:169`, `coach-avatar.tsx:16`, `option-group.tsx:46`, `empty-state.tsx:24`, `todays-mission-card.tsx:21`, `app-header.tsx:37`. Rendered proof: the coach avatar renders as a ring with no fill, and the Interview status badge computes to `rgba(0,0,0,0)`.

**(b) `Icon variant="filled"` destroys Lucide glyphs.** `icon.tsx:48` sets `{ fill: 'currentColor', stroke: 'none', strokeWidth: 0 }`. Lucide is a *stroke* set: open paths have no area, so under fill-with-no-stroke they vanish entirely, and concentric closed paths merge under `fill-rule: nonzero`. Rendered proof: `check` → a solid triangle sliver; `success` (CircleCheck) → a **featureless disc, checkmark gone**; `trophy` → a blob with dangling threads.

The two assessments disagreed on blast radius, so I resolved it directly against Lucide's path data. **6 of the 8 primary nav icons degrade**, and the variant is applied to the **active** item (`nav-item.tsx:40`, `bottom-nav.tsx:33`):

| Nav icon | Lucide | Result under `filled` |
|---|---|---|
| `dashboard` | LayoutDashboard | OK — 4 closed rects |
| `settings` | Settings | OK |
| `coach` | Bot | **Solid rounded block** — antenna, both ears and both eyes vanish (5 open paths) |
| `roadmap` | Route | Two dots, connector gone |
| `resume` | FileText | Solid document silhouette — fold and all three text lines gone |
| `cover-letter` | Mail | Envelope flap gone |
| `applications` | Briefcase | Handle gone |
| `achievements` | Trophy | Handles, base and stem gone (5 open paths) |

**Why it matters.** The failure lands precisely on the states that carry meaning. The **selected** navigation item reads *worse* than its unselected siblings — the one element whose job is to say "you are here" is the one that degrades. The four reassurance icons on the landing page (`page.tsx:296-303`, including `target` → three concentric circles → one solid disc) collapse into near-identical teal blobs. And `processing-screen.tsx:45` renders the "your score is ready" checkmark — the completion beat of the entire assessment — as a featureless disc. PRODUCT.md:99-100 stakes trust on pixel-level polish; this is the opposite.

**Fix.** (a) Make `alpha()` colour-space agnostic — emit `color-mix(in oklab, ${c} 15%, transparent)` — and assert no generated output contains `NaN`. (b) Redefine `filled` in `icon.tsx:44-56` to keep the stroke and add a tinted fill (`fill: 'currentColor', fillOpacity: 0.16, strokeWidth: 2`), which is what `duotone` already does correctly at `icon.tsx:51`. Or drop `filled` entirely and express active state with `tone` + weight, since `nav-item.tsx:41` already colour-shifts on active.

**Suggested command:** `/impeccable polish`

### [P1] First-run is a stranger's dashboard, and the score reveal does not exist

`dashboard-service.ts:98-101` returns `buildMockOverview()` unconditionally — score 68, `streakDays: 5`, 4/12 quests, 12 applications, 91 days of heatmap, `userName: 'Alex'`. `auth-service.ts:60-62` seeds an onboarded returning user. `coach-view.tsx:46` routes from the assessment straight into it. So a user who just finished their first assessment lands on **"Welcome back, Alex"** and a 5-day streak they never earned.

With real data the alternative is worse: `recent-activity-card.tsx:15-31` maps with no empty guard (a titled card containing an empty `<ul>`), `applications-card.tsx` shows 0/0/0, and `activity-heatmap-card.tsx:45-52` renders **91 grey squares labelled "0 active days"**. `EmptyState` exists, is well written, and is wired only to the error branch (`dashboard-view.tsx:66`).

**Why it matters.** Peak-end: the end of the first session determines the memory of the whole session. Right now the end is either fabricated data — which destroys trust the moment the user notices the streak — or an undesigned void that tells an anxious person "you have done nothing." Product-register rule: *empty states that teach the interface, not "nothing here."* A 13-week grid of grey squares is worse than "nothing here." And PRODUCT.md:26-27 names the success condition as a user who says *"the first AI career product that actually made me confident."* That sentence is won or lost in one moment, and that moment is not designed — the number appears inside the second card of a six-card grid.

**Fix.** Three separable pieces. (a) Insert a dedicated reveal route between `processing-screen.tsx` and the dashboard: the ring, the number, one sentence on what a first score means, one CTA to the top gap. (b) Give `RecentActivityCard`, `ApplicationsCard`, `ActivityHeatmapCard` and `RoadmapProgressCard` first-run branches using the existing `EmptyState`. (c) Make `getOverview()` respect a first-run flag and change `dashboard-view.tsx:45` off "Welcome back" when it is not a return visit.

**Suggested command:** `/impeccable onboard`

### [P1] The keyboard and screen-reader path fails at the exact moment of the assessment

- **Focus ring below the non-text minimum.** `--ring` is `brand-500` (`tokens.generated.css:107`): **2.76:1** against `--background`, **2.87:1** against `--card`, **2.61:1** on ghost buttons — all under SC 1.4.11's 3:1. This is the app-wide indicator (`button.tsx:9`, `input.tsx:11`, `option-group.tsx:44`, `nav-item.tsx:26`) and therefore how a keyboard user navigates everything.
- **`option-group.tsx:36` opens a `<fieldset>` with no `<legend>`.** The question lives in a detached `<p>` at `coach-message.tsx:38` inside a separate `role="log"` region, with no programmatic association. A screen-reader user tabbing into the assessment hears *"radio button, 1 of 4, Student / new grad"* — no group name, no question. They answer blind at the moment the product claims to be listening carefully.
- **`coach-message.tsx:38-47` renders the current question as a styled `<p>`, not a heading**, so heading navigation cannot reach "what am I being asked."
- **No `aria-live` on `processing-screen.tsx:50-51`** — the heading flips to "Your score is ready" and the button un-disables with zero announcement.
- **Loading buttons are unreadable**: pixel-sampled from the render, the label sits at **2.29:1 light / 2.56:1 dark** against its own fill (`opacity: 0.5` at `button.tsx`). axe does not flag it because axe skips disabled controls.
- **200% zoom breaks the coach**: at 640×400 effective, the sticky composer (`coach-view.tsx:98`) holding six options plus the Back/Skip/Continue row occupies ~320px of a 400px scrollport, pushing the question permanently off-screen.

**Fix.** Set `ring` to `brand-600` in light (`tokens.ts:227`) for 3.4:1, and gate `ring` vs `background`/`card`/`muted` in the build script. Add `<legend className="sr-only">{question.prompt}</legend>` to `option-group.tsx:36`, threading the prompt from `coach-composer.tsx:72-77`. Promote `coach-message.tsx:38` to a real heading. Add `aria-live="polite"` to the processing status. Raise the loading state's disabled opacity or swap to a spinner with a full-contrast label.

**Suggested command:** `/impeccable audit`

## System-Level Findings

### Typography

**The One-Family Rule holds — but one declared family never paints.** `fonts.ts:17-36` registers three slots. `fontHeading` aliases `geist-sans.woff2`, which is the sanctioned future-swap slot from DESIGN.md:194-196. But `fontMono` is a genuine second woff2, and `font-mono` has **zero call sites** anywhere in `src/` outside its own declaration. DESIGN.md:189-190 specifies Geist Mono for "the Career Score number, metrics, streaks" — every one of those instead uses `font-heading … tabular-nums` (`career-score-card.tsx:44`, `roadmap-progress-card.tsx:30`, `applications-card.tsx:37`, `page.tsx:128`, `stat-card.tsx:42`). A font file ships to every visitor and never renders, and a named rule of the type system is entirely unimplemented. Either delete `fontMono` or actually use it.

**Zero typographic differentiation between the brand surface and the product surface.** The `fontSize` scale (`tokens.ts:426-437`) is Tailwind's default: ratios of 1.11–1.17 through the UI range. For the dashboard and coach that is exactly right — product register asks for 1.125–1.2 and fixed rem, and this delivers both. For the landing page it is a miss: brand register wants ≥1.25 steps and fluid `clamp()`, and `heading.tsx:20-21` gives `text-4xl sm:text-5xl` — a two-step breakpoint jump, not a ramp. The hero's only move is "bigger Geist." Both registers are served by one primitive and the brand surface loses.

**Rendered measurement of the scale** (Storybook, all weight 600, all Geist): 60/lh60/ls−1.5 · 48/48/−1.2 · 36/40/−0.9 · 30/36/−0.75 · 24/32/−0.6 · 20/28/−0.5 · 18/28/−0.45. Steps are distinct and legible at desktop. **At 390px the top two steps collapse** — 6xl→48px and 5xl→36px, making 5xl and 4xl render *identically at 36px*. Two adjacent scale steps become indistinguishable at mobile width.

**Tracking and line-height are applied scale-blind.** `heading.tsx:11` hardcodes `leading-tight tracking-tight` for *every* size from 60px down to 16px, and `globals.css:45` applies `tracking-tight` to all of `h1`–`h6` globally. Two consequences: DESIGN.md:203 specifies Title (1rem) at `letterSpacing: normal` but implementation gives it −0.02em, so 16px card titles get display tracking (`coach-view.tsx:55` renders an 18px `<h1>` at −0.02em — negative tracking at UI sizes costs legibility, and the audience is stressed); and DESIGN.md:28 specifies display line-height 1.1 while `leading-tight` is 1.15, so the 60px hero is looser than spec while the 16px h6 is far too tight. A size-conditional map fixes both: tighter tracking only at ≥2xl, ~1.05 leading at 5xl–6xl, `leading-snug` at base–lg.

**Line-length control is unsystematised.** DESIGN.md:204 caps prose at 65–75ch, but `Text` (`text.tsx:11-59`) exposes no measure variant, so every call site improvises. Some do it right (`page.tsx:243`, `:284`, `todays-mission-card.tsx:38` use `max-w-prose`); `page.tsx:182` is `max-w-3xl` at `text-xl` ≈ **76ch** — over the cap on the single most important paragraph on the site. Add a `measure` variant to `textVariants` and the decision stops being per-call-site.

**Credit where due:** `tabular-nums` is applied correctly and consistently across all 14 numeric displays. That is the detail most systems miss.

**Hierarchy per surface.** Coach is strongest — `coach-message.tsx:39-44` separates the *current* question (`text-xl` semibold) from history (`text-base` at `foreground/90`) using weight and size together, which is the one-typeface promise working exactly as intended. Dashboard is weakest: `CardTitle` is fixed at `text-base` (`card.tsx:47`) while six cards compete, so nothing signals which card matters and the `text-6xl` score is the only anchor.

**Storybook caveat:** `.storybook/preview.tsx` applies `fontVariables` to the decorator div while `globals.css` applies `font-sans` to `body`, where `--font-sans` is undefined. Measured: `getComputedStyle(document.body).fontFamily === "Times New Roman"`. **50 of 73 measured text nodes render serif in Storybook** — headings resolve Geist (they carry `font-heading`), all non-heading copy does not. This is Storybook-only; the app is fine. But it means the team's own component-review environment and its a11y addon have been judging body copy in the wrong typeface. Worth fixing on its own merits.

### Color

**Token-on-token this palette is genuinely well built; every failure is at a composite boundary the gate never sees.**

Light mode: `foreground` on `background` 19.09:1 · `muted-foreground` 7.42:1 (7.73:1 on card) · brand text 6.29:1 · white on primary 6.29:1 · white on success/warning/danger/info 5.48/5.02/6.28/5.93 · brand on brand-muted 6.02:1. All pass, several comfortably.

Dark mode: `foreground` 18.12:1 · `muted-foreground` 7.38:1 · brand text 11.40:1 · ink on primary 6.93:1. Also strong.

**Failures:**

| Pair | file:line | Ratio | Issue |
|---|---|---|---|
| ring vs background (light) | `tokens.generated.css:107` | **2.76:1** | Fails SC 1.4.11 (3:1) |
| ring vs card / vs muted | — | **2.87 / 2.61:1** | Fails |
| white on destructive (dark) | `:198` | **3.67:1** | Fails |
| white on `--brand` (dark) | `:216-217` | **1.50:1** | Latent landmine — `brand-foreground` left white against a `brand-300` brand |
| white on sidebar-primary (dark) | `:210-211` | **2.87:1** | Fails if ever used for text |
| `--brand-muted` (dark) | `:218` | **invalid** | `rgb(NaN NaN NaN / 0.15)` |
| card vs background | `:88,90` / `:183,185` | 1.04 / 1.10:1 | Effectively no separation |

**Does teal+gold carry identity?** No — it degrades to decoration. Gold exists as a discrete UI colour in two places on one non-target page. Everywhere else it is a gradient stop. You cannot point at gold and say what it means.

**Does the Gold-Is-Earned Rule hold?** It is *inverted*. DESIGN.md:178-181 reserves gold for "achievement and brand moments (the gradient, streaks, score highlights)". In practice gold never appears on streaks — `warning` amber does. And gold appears where it is not earned: the "Today's Mission" top rule (`todays-mission-card.tsx:18`) marks a to-do, not a win. **The consequence is a semantic collision on one screen**: `bg-warning-muted text-warning` simultaneously means *"5-day streak — well done"* (`dashboard-view.tsx:50`) and *"your score dropped"* (`career-score-card.tsx:64`), in identical pills, ~600px apart. For an anxious user that ambiguity is exactly wrong.

**Does the Warming-Score Rule hold?** No — see P1 above; it is geometrically inverted. Compounding it, `--score-low`/`--score-mid`/`--score-high` (`tokens.ts:260-262`) are generated, exposed as Tailwind utilities (`theme.generated.css:72-74`), and **consumed nowhere** — while encoding `score-low: danger red`, precisely the "bar of red" DESIGN.md:183 forbids. Dead tokens that contradict a named rule are a trap for the next contributor. Delete them. Separately the rule stops at the ring: `progress.tsx:24` fills with flat `bg-primary`, so `page.tsx:139-149` shows three solid-teal bars beside a gradient ring inside one card — two visual languages for one concept.

**Restrained floor?** Yes on the product surfaces. Accent usage is confined to primary actions, selection and state; `sidebar` provides the second neutral layer product register asks for; the semantic state vocabulary (hover/focus/active/disabled/selected/loading/error) is complete across `button.tsx:9-28` and `input.tsx:11`.

**Is dark mode a real design or an inversion?** Mostly real — `tokens.ts:266-268` picks a deep teal-ink base rather than inverting, primary flips `brand-700`→`brand-500` with ink-on-teal text, shadows deepen. But three tells say it was reasoned about less: `--brand-foreground` left at pure white (1.50:1), `--brand-muted` invalid and unnoticed, and card-vs-background at 1.10:1 with 1.25:1 hairlines — so on a dense surface like the dashboard, six cards nearly dissolve into the page. Light has the same 1.04:1 problem but light has shadows that read; dark's do not.

**Rendered anomalies worth naming.** The gradient button variant has **identical stops in both themes**, and its first stop is the exact light-mode default colour — so in light the two primaries look nearly the same, and in dark their polarity inverts (bright chip/dark text vs dark chip/white text). Status badges: four of five sit 0.006–0.018 below page background, but **Interview sits 0.001 below — effectively invisible in light — and is fully transparent in dark** (the `--brand-muted` bug). Single-select vs multi-select rows differ only by corner radius on a 16px indicator — a ~2px delta as the sole signal between "pick one" and "pick many".

### Background / Backdrop

**On the app surface, it works.** `ambient-backdrop.tsx` is CSS-only, server-rendered, no WebGL, at `opacity-[0.07]`/`0.06` light and `0.20`/`0.14` dark with a 7% top wash. Present, never competing, zero runtime cost. This is the right answer and it should be the template.

**On the brand surface, it does not.** `aurora-backdrop.tsx` stacks four layers: a 55/40/30/20% four-stop wash across the full viewport (`:56-61`), three 42–46rem radial glows at 45/40/35% light and 60/55/50% dark, a WebGL `MeshGradient` at 0.16 opacity with `dark:mix-blend-plus-lighter` (`:94-107`), and a 12% dot grid at 40% opacity. The measured result is that hero copy fails AA in both themes. **It competes with content and content loses.** The 55% base wash alone accounts for most of it; the glows only worsen the floor. `mix-blend-plus-lighter` on the dark mesh is additive over an already-teal wash — it can only push the composite lighter, which is exactly the direction that hurts `muted-foreground` at 1.92:1.

**Reduced motion is handled well but incompletely.** `globals.css:257-266` clamps all animation and transition to 0.01ms; `aurora-backdrop.tsx:34-44` additionally skips WebGL under `useReducedMotion()` and gates the mesh on `hardwareConcurrency >= 4`, `deviceMemory >= 4` and `!saveData` — a genuinely thoughtful capability gate. But `prefers-reduced-motion` is about motion, not visual noise: a user who sets it still gets the full-strength four-layer wash, frozen, and the contrast failure is unaffected.

**Premium, or the banned blob?** The layering is more sophisticated than the average blob and the fallback strategy is better engineered than most production code. But the *silhouette* is the banned one: a fixed full-viewport gradient with three drifting blurred orbs behind a centred hero. PRODUCT.md:71 bans "purple gradient blobs"; this is the same object in teal. Meanwhile `grid-pattern.tsx` is a restrained, distinctive texture used in exactly one place (`empty-state.tsx:23`) — that instinct, applied to the landing page instead, is the more differentiated answer.

**Cost.** `@paper-design/shaders-react` ships a WebGL runtime to every landing and auth visitor on capable devices and holds a live GL context with a continuously animating shader for as long as the tab is open — for a layer rendered at **0.16 opacity underneath a 55% wash**. Disabling the mesh entirely would be visually near-undetectable.

## Persona Red Flags

**Jordan (confused first-timer)** — primary action: "find out where I stand"
- `page.tsx:189-202` offers two equally-sized `size="xl"` buttons. Because `button.tsx:19` implements `gradient` as `bg-gradient-brand-deep` (`brand-700→brand-900`) and `default` is `bg-primary` (`brand-700`), the primary CTA is visually near-identical to a plain teal button. The signature brand gradient the system is named for never actually appears on a CTA.
- `page.tsx:117-154` shows a Career Score of **68** in the hero preview. `dashboard-service.ts:41` returns **68**. Jordan lands on the dashboard, sees the marketing screenshot's exact number, and concludes the score is fake.
- `onboarding-view.tsx:15-42` demands a choice between "Resume + Cover Letter" and "+ Roadmap" before any value is delivered — then `coach-service.ts:96-104` asks the identical question again, unprefilled, with the identical two options.
- `processing-screen.tsx:40` fills a **gold** ring to 72% under "Building your Career Score…" for six seconds. Jordan reads 72 as the score. The dashboard then says 68.
- Arrives at a dashboard reading **"Welcome back, Alex"** with a 5-day streak and 12 applications he never made.
- `career-score-card.tsx:73` uses `type="single"` with all four categories collapsed — the reasoning, which is the entire product promise, is hidden by default and two categories cannot be compared side by side.
- `todays-mission-card.tsx:48` says "120 XP". Nothing anywhere defines what XP is or buys.

**Sam (screen reader, keyboard, 200% zoom)**
- Focus indicator at **2.76:1** (2.61:1 on ghost buttons) — this is how Sam navigates the entire product.
- `option-group.tsx:36` — `<fieldset>` with no `<legend>`: the assessment announces "radio button, 1 of 4, Student / new grad" with no group name and no question.
- `coach-message.tsx:38` renders the current question as a `<p>`, so heading navigation cannot find it.
- `auth-guard.tsx:27` returns `null` during redirect — the page silently empties with no live region, no status, no focus target.
- `processing-screen.tsx:50-51` has no `aria-live`; Sam waits indefinitely for a state that already changed.
- 200% zoom: the sticky composer consumes ~320px of a 400px scrollport, pushing the question permanently off-screen.
- `activity-heatmap-card.tsx:49` puts per-day data in `title` attributes on `aria-hidden` spans — unreachable by keyboard and AT.
- `progress-ring.tsx:44` uses `role="meter"`, which has patchy NVDA/JAWS support, for the product's single most important number.
- `bottom-nav.tsx:17-18` sets `height: var(--bottom-nav-height)` (4rem) *and* `pb-[env(safe-area-inset-bottom)]` — the safe-area padding is consumed inside the fixed height, so on any device with a home indicator the icon+label stack gets ~30px and clips. The label is also `text-[0.7rem]` with no `truncate` — independently flagged by the detector.

**Priya (34, marketing coordinator shifting into UX, working on this at 11pm around a full-time job)** — derived from PRODUCT.md:19-23
- **`coach-service.ts:61-72` asks "Which of these skills do you already have?" and offers only JavaScript/TypeScript, React/frontend, Backend/APIs, System design, Testing, Data/SQL.** Priya is shifting into UX. Six options, none applicable, escape hatch is "Skip". The reasoning text at `:62-63` claims *"We compare these against your target role"* — but she typed her target role as free text at `:28` and the options are hardcoded. The product visibly fails its own evidence-over-assertion promise at the exact moment it claims to be personalising. **This is the sharpest persona break in the product.**
- She will leave mid-assessment — it is 11pm. She clicks **"Save & exit"**. Twenty minutes gone, and the button told her it was saved.
- ~12 seconds of manufactured wait against PRODUCT.md:90's "Never waste the user's time." She has forty minutes tonight.
- She hands over her career history behind a Google-only gate (`google-button.tsx:28-35`) with Terms and Privacy Policy as **unclickable plain text** (`sign-in-view.tsx:47-49`). The only privacy assurance in the product is a placeholder at `coach-service.ts:92`, on question 7 — long after commitment.
- The gamification layer reads wrong for a 34-year-old professional: "Today's Mission", quests, XP, a streak flame, a trophy tab, and a GitHub-style contribution heatmap. Individually restrained; stacked on one dashboard they push toward the anti-reference at PRODUCT.md:73-75. The heatmap is the worst offender — it measures *engagement with the app*, not progress toward a job, and telling a working professional she broke her streak is a guilt mechanic, not a career signal.

## Minor Observations

- `achievement-card.tsx:15` — `locked && 'opacity-70'` drags already-muted text under AA: axe reports **3.64:1** light and **3.89:1** dark on "+250 XP" and the description. The `earned` and `in-progress` variants return zero violations, so the opacity is solely responsible. This was the **only** axe violation across 44 story/theme combinations.
- `app/layout.tsx:35-36` — `themeColor` is `#ffffff`/`#09090b`; the real surfaces are `#f6fbfc`/`#081214`. Mobile browser chrome mismatches the page.
- `app/layout.tsx:49` — `bg-background` on `<body>` is dead code; `globals.css:97` overrides it with `transparent !important`.
- `onboarding-view.tsx:85` and `settings-view.tsx:82` use `border-2` on selection cards, contradicting the Hairline Rule that `card.tsx:15` implements correctly as `ring-1 ring-foreground/10`.
- `onboarding-view.tsx:80-83` uses `aria-pressed` toggle buttons for a mutually exclusive choice while `option-group.tsx:50` uses native radios for the same interaction. Two vocabularies, one product.
- `typing-indicator.tsx:12` sets `aria-label` on a `role="status"` container, overriding the `sr-only` text at `:28` and making that span dead.
- `sign-in-view.tsx:55` uses `text-foreground/90`, the opacity-based tone that `text.tsx:30-31` explicitly rejects.
- `resume-preview.tsx:19` hardcodes `text-[0.7rem]` and `text-[var(--neutral-500)]`, bypassing the `Text` primitive whose doc comment forbids exactly that.
- `progress-ring.tsx` sizes are hardcoded px with rem-scaled children; under browser font-size-only increase, "100" at `text-6xl` approaches the ring's inner edge.
- Placeholder text at 7.73:1 is arguably *too* strong — an empty field is hard to distinguish from a filled one at a glance, notably `coach-composer.tsx:98`.
- `empty-state.tsx:24` hardcodes a brand-teal disc regardless of `icon`, so the dashboard error state (`dashboard-view.tsx:67`, `icon="warning"`) renders a calm teal warning triangle identical to a normal empty state.
- `reveal.tsx:35-38` sets `initial={{ opacity: 0 }}`, so if Motion fails to hydrate, everything below the landing fold is invisible. The hero correctly avoids this via the CSS-only `hero-stagger`; the pattern should extend downward.
- `app-header.tsx:91-100` leaves the entire left side of a 64px desktop bar empty — no page title, no breadcrumb, no context.
- `stat-card` tones use four different accent hues across four tiles; the "Day streak" card matches the "Career score" card height, leaving a large empty band because only Career score carries a delta pill.

## Coverage Gaps

- **No full-page composition evidence.** Storybook renders isolated components on a 2rem decorator. Nothing here tests vertical rhythm, section pacing, above-the-fold hierarchy, or nav/sidebar/content relationships on the four target surfaces. Composition findings above come from source review, not from a render.
- **The landing page and sign-in are NOT Clerk-gated and would render under `next dev`.** This is available-but-not-run evidence covering the two most composition-heavy public surfaces — including direct verification of the P0 contrast numbers.
- All non-heading type in every screenshot is Times New Roman (the `.storybook/preview.tsx` scoping defect), so body-copy texture and heading/body pairing could not be judged visually.
- Dark screenshots understate intended brand-tinted surfaces because `--brand-muted` is broken — dark mode was judged against a partly-unstyled baseline.
- No hover/focus/active states captured, no motion or reduced-motion pass, no real data volume (long strings, i18n, truncation), no tablet breakpoint.
