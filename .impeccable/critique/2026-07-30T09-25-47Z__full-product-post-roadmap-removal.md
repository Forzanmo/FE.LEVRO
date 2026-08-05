---
target: full product (post roadmap removal)
total_score: 25
p0_count: 1
p1_count: 4
timestamp: 2026-07-30T09-25-47Z
slug: full-product-post-roadmap-removal
---
Method: dual-agent (A: design review `a92dbaded89e69321` · B: detector + runtime `a1bc5879610f932cb`)

Target: full product after the roadmap removal (uncommitted working tree, 95 modified / 15 deleted).
Evidence: bundled `detect.mjs` (CLI + in-page), `tsc`, `eslint`, `next build`, `check:contrast`, `check:a11y`, axe-core over 52 renders, Playwright capture across 14 routes × 2 journey states × 2 themes × 2 viewports (120 screenshots), Playwright e2e suite, focus-order walk on `/coach` and `/applications`.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Real skeletons, `aria-live`, honest save states; `SaveStatus` renders nothing in `idle`, so `/resume`'s "saves automatically" has no affordance until first keystroke |
| 2 | Match System / Real World | 2 | Shipped copy sells a deleted product: `sign-in-view.tsx:16` promises a Career Readiness Score that no longer exists; `settings-view.tsx:140` says "your next quest" |
| 3 | User Control and Freedom | 3 | Back / Skip / Edit / Save-&-exit / Resume all present; "Start over" still destroys a saved assessment with no confirmation |
| 4 | Consistency and Standards | 2 | Nested cards at `resume-editor.tsx:94` violate a bolded DESIGN.md rule; three near-identical warm pills mean *problem*, *achievement*, *achievement* on one dashboard |
| 5 | Error Prevention | 2 | `hasAssessment()` is checked in one service out of six; five surfaces serve fabricated history to users who have done nothing |
| 6 | Recognition Rather Than Recall | 3 | Reasoning disclosure and per-skill evidence are strong; dashboard truncates the only identifying field on document rows |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts anywhere; no bulk actions on a 14-row table; no way to skip the assessment; the onboarding plan choice is inert |
| 8 | Aesthetic and Minimalist Design | 3 | Twelve routes are genuinely restrained; `/achievements` stacks two absolute bans; `/cover-letter` leaves ~65% of a 1440×900 viewport empty |
| 9 | Error Recovery | 2 | In-view error states are excellent, but there is **no `error.tsx`, no `not-found.tsx`, no error boundary anywhere in `src/app`** — and localStorage quota failures are still swallowed |
| 10 | Help and Documentation | 3 | Best-in-class contextual help ("Why I'm asking", per-template trade-offs); no help entry point in the app shell |
| **Total** | | **25/40** | **Acceptable** — down from 30/40 |

The four-point drop is **not** a regression in executed quality, which measurably improved. It is new debt created by an incomplete deletion, concentrated in exactly the axes a half-finished refactor damages: 2, 4, 5, 7, 9.

## Anti-Patterns Verdict

**Does this look AI-generated? Mostly no — and where it fails, the tell is semantic, not visual.**

**LLM assessment.** Twelve of fourteen routes would survive a Linear/Notion/Stripe user's scrutiny. The absolute bans are held: zero purple/indigo/violet, zero `background-clip: text`, zero bounce/elastic easing, no decorative glassmorphism, no text overflow. The landing hero is genuinely committed — theme-invariant drenched teal, asymmetric grid, the product's real artifact (a CV sheet) with a real gap ("System design — Not shown") as the hook. That passes the second-order reflex check: it is neither the modal AI-career hero nor the editorial-typographic lane you'd predict from avoiding it.

Three failures:

1. **`/achievements` is the one page that reads as generated.** It stacks a 3-across hero-metric row (`achievements-view.tsx:37-46` — Unlocked / XP earned / In progress) directly above a 12-tile identical 3-column card grid (`:75-79`). Two absolute bans on one screen. It also imports XP into a product whose own anti-references name "badge overload that undercuts credibility" — and with the roadmap deleted, nothing feeds it.
2. **The gold renders as mud.** Earned tiles resolve to `accent-800` on the light surface — drab khaki-brown, not the `#e7a929` of the north star. Five large brown squares is the opposite of "your moment," and using gold on five of twelve tiles defeats DESIGN.md's own argument that "its rarity is what makes it read as a win."
3. **`/applications` opens with 4 identical stat tiles** (`pipeline-summary.tsx:19-37`) before the table. Same hero-metric shape.

Below the hero, the landing page loses its nerve: the features `<dl>` and the numbered `<ol>` are both monochrome type-on-white, gold appears nowhere after the fold, `lg:sticky lg:top-28` at `page.tsx:302` never actuates (the right column is too short), and the four-item reassurance row wraps to leave one orphan centered while the whole page is left-aligned. One committed fold is carrying the entire brand.

**Deterministic scan.** `detect.mjs --json src` → **exit 2, 1 finding**: `design-system-font-size`, `text-[0.6rem]` at `icon.stories.tsx:46`, off the DESIGN.md ramp. Storybook-only, not in the production bundle. Verified nothing is being suppressed — no `.impeccable/config.json`, zero `impeccable-disable` comments, and `--no-design-system` / `--no-config` both return 0, so the delta is purely additive.

The in-page detector found more, because regex-over-source cannot see composed Tailwind or rendered geometry. After filtering:

- **Real:** `layout-transition: width` on the sidebar (`sidebar.tsx:24`, confirmed present in the production CSS); `line-length ~89ch` on the coach's reasoning paragraph (`coach-message.tsx:83`) against DESIGN.md's own 65–75ch cap; 3× `heading-rhythm` on `/` (h3s with 28px above vs 52–131px below); 2× `text-overflow` on `/dashboard` truncating document titles by 53px and 20px.
- **False positives, disproved rather than waved off:** `gradient-text` and `transition: height` fired on all five pages — they come from the Next dev-overlay *stylesheet*, absent from the production CSS, and there is no `bg-clip-text` anywhere in `src/`. `low-contrast 1.0:1 (#ffffff on #ffffff)` on the hero h1 is the detector failing to parse the CSS `lab()` color function; disproved three ways (painted ancestor is `lab(14.3 -12.3 -5.6)`, transparent-glyph screenshot gives backdrop pixels ≈17:1, and `check-contrast.mjs` passes `/` with 56 text runs).
- **False positives I caught that Assessment B passed through:** the 3× `nested-cards` on `/dashboard` are not cards. `recent-documents-card.tsx:48` is a hover row (`rounded-lg` + hover bg, no card surface or ring) and `:52` / `recent-activity-card.tsx:29` are `size-8 bg-muted` icon tiles. The detector matched "rounded container inside a card" heuristically. **The `/resume` nested card is real** and is reported as a priority issue below.

**Where the detector beat the design review:** the 89ch coach reasoning line and the sidebar width transition. **Where the design review beat the detector:** every finding that matters. No static rule can see that the app congratulates you for an assessment you never took.

**Runtime gates — the execution quality here is genuinely excellent:**

- `tsc` exit 0 · `eslint --max-warnings 0` exit 0 · `next build` exit 0 (16 pages)
- `check:contrast` → **PASS, 2080/2080 text runs clear WCAG AA** across 68 renders, every route in its intended state, `/documents` and the `[id]` routes included
- `check:a11y` → **PASS, 0 axe violations and 0 keyboard findings** across 68 renders; independently confirmed with axe-core injected over 52 more renders
- **0 console errors, 0 page errors, 0 console warnings, 0 hydration warnings** across all 52 renders. (Assessment A saw 24 hydration warnings and correctly self-flagged them as an artifact of its own pre-hydration `localStorage.theme` write; B's clean run settles it.)
- Focus visibility: **0 failures** across 17 tab stops on `/coach` and 28 on `/applications`, both themes

**But both strong gates are broken as run, and neither is in `verify`.** `check-contrast.mjs` and `check-a11y.mjs` hardcode `--base http://localhost:3000` with no port autodetection and no `webServer` bootstrap. With nothing on 3000 they exit 2 with `FAIL — no text runs were measured`. They fail closed, which is right, but they cannot run unattended — and `"verify": typecheck && lint && build` omits both. The two gates that produced every number above are the two a CI run would never execute.

**Visual overlays.** Injection succeeded — `document.title` mutation, inline `<script>`, and `addScriptTag` all worked; live server ran on port 8400 and `detect.js` was injected on `/`, `/dashboard`, `/coach`, `/documents`, `/applications`. The live server has since been stopped (pid 21916 confirmed gone, port 8400 free), so **there is no overlay currently visible in your browser** — the console findings above are the durable output.

## Overall Impression

The craft is real and it is measured, not asserted: 2080/2080 text runs at AA from rendered pixels, zero axe violations, zero console errors, perfect focus visibility. Most teams claim this; this one proves it. The coach is the best thing in the product and the skills-coverage card is a better idea than the Career Readiness Score it replaced.

And the product it adds up to currently lies to its users. Not through malice — through an unfinished deletion. The roadmap and the score were removed from the code and left standing in the copy, the fixtures, and PRODUCT.md. A brand-new visitor who clicks Achievements is told, in gold, that they "Completed your career assessment." They didn't. For a product whose first design principle is *evidence over assertion* and whose voice "never hypes and never hallucinates," this is the most expensive possible bug, and it is one sidebar click away from the honest empty state that sits three files over.

**The single biggest opportunity:** the assessment currently ends by dumping the user into a form. Route it to the dashboard instead. The skills read-out they were promised already exists, is good, and is the answer to the question the landing page asks — it is just sitting on a page they reach by accident. That is a one-line change that converts the product's worst moment into its best.

## What's Working

**1. The skills-coverage card is a better product decision than the score it replaced.** `skills-coverage-card.tsx:47-54` sorts gaps first (`ORDER = ['missing','partial','strong']`) because, as the code says, "the reason to open this card is to find what to fix." Each row expands to its own evidence sentence, and status is carried by the text chip with the dot as reinforcement only (`:23-28`), so it survives color-blindness. Replacing a vanity number with a reasoned, actionable inventory is the right call — the problem is everything downstream that wasn't updated to match.

**2. The coach is exemplary and should be the template for the rest of the app.** `coach-view.tsx:100-102` keeps every answered question in the transcript when you edit an earlier one, killing the class of bug where a user watches their work vanish. `option-group.tsx` delegates to the shared `ChoiceGroup`, so radio semantics, roving focus, and "radio, 2 of 4" announcements come free. `coach-composer.tsx:37-40` prefills from props keyed by question id, so Back and Edit restore state with no sync effect. One question, four options, "Why I'm asking," 1/8 progress — this is the calmest screen in the product and the only one that fully delivers the brief.

**3. Committed-Surface and Paper rules are held honestly, and the gates prove it.** The hero and CTA band are theme-invariant deep teal in both light and dark (verified across all four captures), and every CV renders on the single shared `SHEET_SURFACE` — including the landing page's product shot at `page.tsx:147`, which means the marketing image is literally the artifact the user receives. Meanwhile `globals.css:117-119` documents *why* the gold half of the brand gradient is excluded from button fills (it fails AA under white text), so `bg-gradient-brand` has exactly one call site: the logo. That is a system whose rules have reasons attached.

## Priority Issues

### [P0] Five services serve fabricated history to users who have done nothing

**What.** `journeyStorage.hasAssessment()` is checked in exactly one place — `dashboard-service.ts:164`. Verified by grep: every other call site is a type field or the dashboard view. Every other service returns seeded fixtures unconditionally. A brand-new visitor with zero assessment sees:

- `/achievements`: "Unlocked 5/12 · XP earned 270", including **"First Steps — Completed your career assessment ✓ Earned"** and "Warming Up — Kept a 5-day activity streak ✓ Earned" (`achievements-service.ts:4-40`, `status: 'earned'` hardcoded)
- `/documents`: four documents, two marked "Sent" (`documents-service.ts:43+`)
- `/resume`: a complete CV with invented employment history (`resume-service.ts:14`)
- `/applications`: 14 applications

**Why it matters.** This is the identical P0 fixed on 2026-07-29 — "a brand-new visitor was shown a Career Readiness Score of 68 with fabricated evidence" — relocated rather than eliminated. The dashboard was patched at the call site; the leak was not closed at the source. Congratulating a user for work they never did is the precise inversion of "trust is earned through transparency, not confidence tricks," and it is reachable in one click from the honest empty state.

**Fix.** Move the gate into the data layer, not the call sites. Have each service mirror `dashboard-service.ts:164-166` and return empty collections when `hasAssessment()` is false — then no view can forget. The call-site approach has now been forgotten five times, which is the argument against it.

**Suggested command:** `/impeccable harden`

### [P1] The assessment ends in a form instead of the verdict it promised

**What.** `coach-view.tsx:72` — `<ProcessingScreen onComplete={() => router.push(ROUTES.resume)} />`. The user answers 8 questions, watches a 6-second progress ring, clicks "Open my CV," and lands in a text-input form.

**Why it matters.** Peak-end rule, and the codebase already knows it: `journey-storage.ts:5-8` argues in its own header that "the end of the first session is what the whole session is remembered by." The landing page sells "See what your CV proves"; step 2 of the three-step section is literally titled that. The user does all the work and never sees step 2. Meanwhile `dashboard-view.tsx:61` already renders "Your plan is ready, {name}" on `isFirstRun` with the skills card as hero — the payoff exists and is unreachable except by accident.

**Fix.** Route completion to `ROUTES.dashboard`. The CV then becomes the *next* step, reached from a named gap — which is also the order PRODUCT.md describes ("producing the recruiter-ready assets at the right stage of the journey rather than up front").

**Suggested command:** `/impeccable onboard`

### [P1] The dashboard diagnoses and then abandons

**What.** The populated dashboard renders four cards (`dashboard-view.tsx:124-134`) carrying 16 data points and **zero action buttons**. The header's only controls are a streak chip and an "All documents" ghost link (`:72-85`). Skill rows expand to reasoning and dead-end there — no "Fix this," no link to the coach or the editor.

**Why it matters.** The user is told "System design — Not shown" and "Testing — Thin," then must memorize the verdict, leave the page, guess which of 8 sidebar destinations is correct, and re-derive what to write. That is the Memory Bridge and the Context Switch in one interaction, on the home screen, for the most anxious user in the product's audience. The roadmap was the next-step mechanism; it was deleted with nothing in its place, so the product now performs the diagnosis half of its promise and stops. For someone already uncertain, information without a remedy converts directly into anxiety.

**Fix.** Give each `missing` / `partial` row a primary action in its expanded content routing to the surface that fixes it, and promote the highest-priority gap into a single "Next step" affordance in the page header. One action — not a restored roadmap.

**Suggested command:** `/impeccable layout`

### [P1] Shipped copy describes a product that no longer exists

**What.** Three stale references, all verified by grep:

- `sign-in-view.tsx:16` — "A measurable Career Readiness Score in minutes" is the **first** of three value props on the conversion screen. The score is gone; the only other match in `src/` is the comment at `skills-coverage-card.tsx:16` explaining its removal.
- `settings-view.tsx:140` — "Nudges to complete your next quest." "Quest" appears nowhere else in the product; the quest components were deleted.
- `PRODUCT.md:38-40` still describes the dashboard as "the Career Score, roadmap progress, the AI Coach, an activity heatmap, achievements, recent activity, and job applications." Four of those seven no longer exist.

Also in this class: `icon/registry.ts:77` still defines a `roadmap` icon with zero usages; `routes.ts:5` defines `signUp: '/sign-up'` with no such page; `e2e/roadmap.spec.ts` still exists and `/roadmap` returns 404. **8 of 19 e2e tests fail**, all from stale expectations, none a runtime regression.

**Why it matters.** The sign-in promise is a false claim at the exact moment the user decides to hand over their employment history — in a product whose stated personality is "never hyping and never hallucinating." It is also incoherent with its own funnel: the landing page never mentions a score, so this card *introduces* an expectation nothing before or after it supports. And PRODUCT.md being wrong is the compounding failure: every future contributor, human or agent, builds from it.

**Fix.** Rewrite the sign-in prop to match what ships ("See which skills your CV actually proves") and audit the other two against real behavior. Replace "quest" with "next step." Update PRODUCT.md's Purpose and dashboard-contents paragraphs to describe the shipped product — or make an explicit decision that the roadmap is coming back and mark it as roadmap, not as present tense. Delete the dead icon, the dead route, and `e2e/roadmap.spec.ts`; fix the seven other stale specs.

**Suggested command:** `/impeccable clarify`

### [P1] Two named DESIGN.md rules are violated by the code that documents them

**What.**

1. **Nested cards.** `resume-editor.tsx:25` defines `SectionCard` as `bg-card ring-foreground/10 rounded-xl p-5 ring-1`; `:94` nests `<div className="border-border space-y-3 rounded-lg border p-4">` inside it for each role. DESIGN.md §5, bolded: "**Never nest a card inside a card.**" Plainly visible on `/resume` as "Role 1" and "Role 2" boxes inside the Experience box.
2. **The amber/gold collision is back.** On one dashboard screen: "Thin" renders `bg-warning-muted text-warning` (`skills-coverage-card.tsx:38`), "5-day streak" renders `bg-achievement-muted text-achievement` (`dashboard-view.tsx:73`), and "Sent" renders gold. Three near-identical warm pills meaning *problem*, *achievement*, *achievement* — nearly indistinguishable in dark mode. DESIGN.md's Gold-Is-Earned Rule names this exact defect as already fixed: "the two were colliding on one screen, where an identical amber pill meant both 'well done' and 'something is wrong'."

Minor siblings: onboarding and template option cards use `border` + `rounded-2xl` against the Card primitive's hairline ring + `rounded-xl`; the landing footer says "Resume" at `page.tsx:71` where `navigation.ts:20` deliberately renamed it "Edit CV" with a comment explaining why.

**Why it matters.** DESIGN.md's own position is that "craft is the trust signal — pixel-level polish reads as competence." A system that documents a rule, states in writing that it fixed the violation, and then ships the violation is worse than one with no rule: it means the document can't be trusted as a description of the code.

**Fix.** Flatten the role blocks to hairline-separated groups inside `SectionCard` (divider + label, no border/radius/padding box). Move the skill-status chips to a neutral/outline family and reserve warm fill exclusively for completion. Rename the footer link.

**Suggested command:** `/impeccable polish`

## Persona Red Flags

**Jordan (Confused First-Timer)** — the closest match to PRODUCT.md's stated user.
- Signs in on the promise of "A measurable Career Readiness Score in minutes" (`sign-in-view.tsx:16`), completes 8 questions, and is deposited in a CV form. No score ever arrives and nothing tells him it isn't coming. He will assume he did something wrong.
- Makes his first decision at `/onboarding` between "Just my CV" and "CV + cover letters." `plan` is written by `completeOnboarding()`, re-exposed at `session-provider.tsx:68`, and **read by no UI anywhere** — "Cover Letter" is in the sidebar either way. His first act of agency is theatre.
- Reads "System design — Not shown," expands for the reasoning, finds no action. He now knows he is deficient and has been handed no instrument.
- Faces 8 sidebar destinations with no indication which is next.

**Riley (Deliberate Stress Tester)** — breaks this build in under two minutes.
- Signs up fresh, opens Achievements, is told he "Completed your career assessment" and "Kept a 5-day activity streak." Everything the product says is now suspect.
- Opens `/documents/cv-northwind` (Alex Rivera, Manchester UK, +44 7700 900123, "Frontend Engineer · Northwind 2024—present"), clicks **Edit** at `document-detail-view.tsx:160`, and lands on `/resume` showing **a different CV** (Berlin DE, +1 (555) 123-4567, "Frontend Intern · Northwind Studio 2023—2024"). Two separate `BASE_RESUME` fixtures — `documents-service.ts:40` vs `resume-service.ts:14` — behind one Edit button. The library implies per-document editing that does not exist.
- Counts 14 rows on `/applications`; the dashboard says "12 Total" (`dashboard-service.ts:131` hardcodes it). Also reads "**1 Offers**" — `applications-card.tsx:16` never singularizes.
- Navigates to `/roadmap` (bookmarked yesterday) and gets Next's stock unbranded `404: This page could not be found.` — no app chrome, no way back. There is no `not-found.tsx`, no `error.tsx`, and no error boundary anywhere in `src/app`.
- Hits "Start over" on a saved assessment and loses it with no confirmation (`coach-view.tsx:52`).

**Casey (Distracted Mobile User)** — from the 390×844 captures.
- **`/dashboard` is the only route of 13 with horizontal overflow at 390px** — `scrollWidth` 393 vs `innerWidth` 390. Root cause measured: the skills card's min-content width is 377.1px against a 358px track; the accordion trigger's `flex flex-1` span at `skills-coverage-card.tsx:73` still defaults to `min-width: auto` because the `min-w-0` sits on the *inner* span at `:74`, so the track can't shrink.
- The one piece of earned-momentum reassurance, the streak chip, is `hidden … sm:inline-flex` (`dashboard-view.tsx:73`) — invisible on the device job-seekers actually use.
- Document titles truncate to "React & component archit…" and "Junior Developer — Product S…", losing the only field that distinguishes two CVs.
- Bottom nav carries 5 of 8 destinations; Achievements and Settings are unreachable from it.
- Every primary action (Start my assessment, Generate cover letter, Download PDF) sits at the top of the page, outside the thumb zone.

**Priya, the anxious first-time job-seeker** (derived from PRODUCT.md: "arrive uncertain and often anxious").
- Her first authenticated screen is a single dashed box in an otherwise empty 1440×900 page — ~70% blank below it. No indication of how long the assessment takes, what it asks, or what she gets. For someone deciding whether to trust this with her career, emptiness reads as abandonment.
- After the assessment she is told three of five skills are Thin or Not shown, on a screen with no remedy. PRODUCT.md's requirement — "leave an anxious first-time job-seeker feeling confident and motivated, certain they have a clear path and can walk it" — is inverted.

**Marcus, the career shifter** (PRODUCT.md's co-primary audience).
- Selects "Career shifter" at question 1, then is assessed against a hardcoded software-engineering vocabulary — React, TypeScript, System design (`HERO_SKILLS` at `page.tsx:58-62`, and the coach's option sets). Flagged in the 2026-07-29 snapshot and unchanged.
- `/achievements` awards XP for a game he did not opt into — precisely the "badge overload undercuts credibility" failure mode PRODUCT.md warns about, and the worst fit for an adult mid-career changer.

## Minor Observations

- **[P2] No `error.tsx`, `not-found.tsx`, or error boundary anywhere in `src/app`.** An unhandled render error has no recovery path, and a 404 is unbranded stock Next. Cheap to fix, disproportionate trust cost.
- **[P2] Dashboard horizontal overflow at 390px** — 3px, root-caused above. Move `min-w-0` to the `flex-1` span at `skills-coverage-card.tsx:73`.
- **[P2] `check:contrast` and `check:a11y` hardcode port 3000 and are absent from `verify`.** The project's two strongest gates cannot run unattended and are not in the chain. Add port autodetection or a Playwright `webServer`, then add both to `verify`.
- **[P2] 11 real sub-24px touch targets at 390px** with no `after:` expansion, against DESIGN.md's stated rule. The 7 footer links at `page.tsx:463-470` (18px tall, standalone `<li><Link>` navigation) are a genuine WCAG 2.2 SC 2.5.8 failure — the inline-text exception does not apply. The `/sign-in` Terms/Privacy links and the `/privacy` email are inline in sentences and therefore WCAG-exempt, but DESIGN.md's rule is written without that exception; either honor it or amend the rule. (8 other controls correctly use `after:`; 11 more are false positives — `sr-only` skip links and `peer.sr-only` inputs.)
- **Coach reasoning paragraph runs ~89 chars/line** (`coach-message.tsx:83`) against DESIGN.md's own 65–75ch cap.
- **`/documents` section label renders as "CVS"** — the source correctly says `CVs` at `documents-view.tsx:112`, but `uppercase` at `:111` turns it into the pharmacy chain. Drop the transform on this label or write it as "Résumés / CVs" without it.
- **`applications-card.tsx:16` renders "1 Offers"** — never singularizes.
- `processing-screen.tsx:64-66` — comment still describes copy that changed ("the heading silently flips to 'Your score is ready'"); the rendered string is now "Your CV draft is ready."
- `/cover-letter` leaves ~65% of a 1440×900 viewport empty; `/resume`'s 50/50 split leaves the right column ~65% blank (editor ~1700px, sticky preview ~620px).
- `/cover-letter` asks the user to type "Key points" by hand while `onboarding-view.tsx:42` promises "Cover letters written from the same evidence." The letter is not built from the assessment at all.
- `PipelineSummary` progress bars (`pipeline-summary.tsx:29-34`) encode `count/total` with no label or legend — the proportion is unreadable.
- Landing footer "Product" links (`page.tsx:68-73`) all point into authenticated routes; every one bounces a logged-out visitor to sign-in.
- A visible horizontal seam runs the full page width at the aurora backdrop's gradient boundary (~y=645 at 1440px), pronounced in dark mode on `/`.
- `authService.seedReturningUser()` still returns an authenticated, onboarded user by default, so `/sign-in` and `/onboarding` are unreachable without explicit seeding — the real first-run funnel is bypassed in normal development. Unresolved from the prior snapshot.
- localStorage quota failures are still swallowed silently in all three storage modules. Unresolved from the prior snapshot.

## Questions to Consider

1. **If the Career Readiness Score and the roadmap are gone, why does PRODUCT.md still open with both?** Four of the seven dashboard widgets it names no longer exist. Either the document is now fiction or the deletions were a mistake — it cannot be both, and every future contributor will build from the wrong one.
2. **The skills card is a better idea than the score. Why is it hiding on a page the user reaches by accident?** It is the direct answer to the question the landing page asks. Make it the destination of the assessment and the product's actual center of gravity.
3. **What is `/achievements` for now that the roadmap is gone?** It is the only route that violates two absolute bans, it hosts the product's own gamification anti-reference, and nothing feeds it. Deleting it would raise this score. What actually breaks?
4. **Eight sidebar destinations, for a product whose principle is "one primary goal per screen."** Documents / Edit CV / Cover Letter are three doors into one artifact. What does this look like as four?
5. **If a user must never be told they did something they didn't, why is that enforced in one service out of six?** The gate belongs where forgetting it is impossible.
6. **What would a confident version of the dashboard look like?** Probably not four cards. Probably one sentence naming the biggest gap, one button that closes it, and everything else collapsed beneath.
