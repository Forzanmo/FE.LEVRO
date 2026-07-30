---
target: ready to deploy?
total_score: 29
p0_count: 2
p1_count: 3
timestamp: 2026-07-30T14-59-53Z
slug: full-product-deploy-readiness
---
Method: dual-agent (A: design review · B: detector + measured browser evidence, isolated until synthesis)

Target: the full product, asked as "ready to deploy?" — measured against the production build at `next start`, not the dev server.

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Live "Saved" status, `aria-live` undo toasts, `AuthGuard` announces its redirect. But the notifications bell is permanently "You're all caught up" — a control that can never carry information. |
| 2 | Match System / Real World | 3 | Plain, human, non-jargon throughout. But the first-run panel promises "Eight questions" and the assessment has seven. |
| 3 | User Control and Freedom | 3 | Back, save-and-exit, per-answer edit, undo on both destructive deletes, two exits from the 404. But a hardcoded 6-second wait with no skip, and no way to retake the assessment. |
| 4 | Consistency and Standards | 3 | One family, one button system, Filled-Is-Earned honoured product-wide. Deducted for the lone Title Case CTA and the four-stat-card idiom appearing on exactly one page. |
| 5 | Error Prevention | 2 | Input caps, required-field validation, undoable deletes — but `/cover-letter` will generate and offer for download a confident letter for a visitor with no assessment and no evidence. |
| 6 | Recognition Rather Than Recall | 3 | Skill verdicts carry their reasoning inline; templates state their trade-off at the point of choice. But the pipeline counts never reconcile with the table beneath them. |
| 7 | Flexibility and Efficiency | 3 | Collapsible sidebar, sort, filter, search, arrow-key roving, working skip link. No bulk actions, no shortcut layer. |
| 8 | Aesthetic and Minimalist Design | 3 | Genuinely restrained. Deducted for the hero-metric row on `/applications` and a marketing strip that orphans its 4th item at 1280. |
| 9 | Error Recovery | 3 | Inline field errors, a branded 404 that says the user's work is safe. But the coach's disabled Continue measures 2.25:1 and never says what's missing. |
| 10 | Help and Documentation | 3 | "Why I'm asking" on every coach question is the best help pattern here. No route to support from inside the app. |
| **Total** | | **29/40** | **Good — solid foundation, two release-blocking defects** |

## Anti-patterns verdict

**LLM assessment: no.** Nobody would say "an AI made this", and it isn't close. The homepage takes three consecutive sections in three genuinely different forms — an editorial specimen list, a railed ordinal sequence, a rule-separated statement band — rather than three icon grids in teal. Numbered markers appear once, on a rail where the order *is* the information, which is the earned case. No gradient text, no side-stripes, no decorative glass, no eyebrow-above-every-section.

**One hit:** `/applications` ships four visually identical stat cards — big mono numeral, label, proportion bar — above the table (`pipeline-summary.tsx:19–33`). That is the hero-metric template, and DESIGN.md records the achievements screen being deleted for this exact shape.

**Deterministic scan: clean.** `detect.mjs --json src` returned `[]`, exit 0, across 170 files — and that null is trustworthy: B re-ran with `--no-config`, confirmed no `ignoreRules`/`ignoreFiles` and zero `impeccable-disable` comments, then proved the detector still fires by feeding it a synthetic bounce-easing violation.

**Visual overlays:** none. B confirmed injection *would* work (title set, script executed, fixed overlay rendered, no CSP) but deliberately did not build one, so there is no overlay in any browser tab.

## Where the two assessments agreed, and where I overruled one

Both independently found the auth seed makes `/sign-in` and `/onboarding` unreachable.

**I overruled Assessment A on its most alarming claim.** A reported that a brand-new visitor is greeted with "Welcome back, Alex Rivera", a 5-day streak and 14 applications. I tested a genuinely unseeded context against the production build: the dashboard renders **"Let's get started, Alex Rivera"** and the first-run panel — no streak, no applications, no skills verdict, `assessmentCompletedAt: null`. The service-level assessment gate holds. A carried its seeded fixture into that judgement. The real defect is narrower and stated correctly below.

## Overall impression

The craft is genuinely above average and the accessibility work is provably, not aspirationally, correct — 26 axe audits across both themes with zero violations, each backed by a positive control. What stands between this and deployable is not polish. It is two things that are one decision each: nobody can sign up, and one of five services forgot the gate that defines the product's honesty.

## What's working

1. **The template picker turns the anti-reference inside out.** Three CV templates as a real `<fieldset>` of radios, each stating its trade-off *in the card* — "ATS: large employers and job boards that machine-screen before a human reads." A junior has no way to know a two-column CV can silently cost them an interview. This tells them at the moment of choice, in one sentence, without condescension.

2. **Four gated surfaces, four genuinely different empty states.** `/resume` pre-assessment offers "Start my assessment" *and* a secondary "Start from a blank CV" — the escape hatch that stops the gate feeling like a wall. Each surface writes its own words rather than sharing one component's.

3. **The accessibility claim is proven on rendered pixels.** Zero axe violations across 26 route/theme/viewport audits, 0 focus stops without a visible indicator across 67 stops, 0 sub-24px touch targets once hit-area expanders are measured properly, and composited muted text at 6.25:1–10.15:1 including over the aurora backdrop — the surface where systems like this quietly fail.

## Priority issues

**[P0] Nobody can sign up. Every first visit is silently authenticated as a fictional user.**
`session-provider.tsx:36` calls `authService.getSession() ?? authService.seedReturningUser()`, which writes `{ authenticated: true, hasOnboarded: true }` on first paint. Verified against the production build: `/sign-in` and `/onboarding` both redirect to `/dashboard`, and every marketing CTA lands there too. The conversion funnel has no bottom — day one produces zero accounts. The visitor is also greeted by name as "Alex Rivera", a person who is not them.
**Fix:** gate the seed behind `NEXT_PUBLIC_DEMO_MODE`, defaulting unset to `{ authenticated: false }`. `AuthGuard` already handles the unauthenticated redirect correctly; it simply never fires. If demo mode ships publicly it needs a persistent "You're viewing sample data" bar.
**Suggested command:** `/impeccable harden`

**[P0] `/cover-letter` fabricates a sendable document for users with no evidence.**
`applications-service`, `documents-service` and `dashboard-service` all consult `journeyStorage.hasAssessment()`; `resume-service` is gated via `useResume`. `cover-letter-service` and `cover-letter-view` consult nothing. With `levvro:journey === null`, entering a company and role produces a complete four-paragraph letter — "my background maps closely to what the role needs", "I have followed the work your team publishes" — signed with the user's name, with Copy and Download PDF live. This is the artifact the candidate emails to a real recruiter, and the product invented its contents. DESIGN.md says the call-site version of this gate "shipped twice and was forgotten five times"; this is the sixth.
**Fix:** move the check into `coverLetterService.generate()` so no call site can forget it, and give `/cover-letter` the pre-assessment empty state its three siblings already have.
**Suggested command:** `/impeccable harden`

**[P1] The first-run panel promises "Eight questions"; the assessment has seven.**
`first-run-panel.tsx:54` says "Eight questions, one at a time". `coach-service.ts` defines seven. This is a regression introduced during this session's polish pass — deleting the coach's duplicate final question took it 8 → 7 and the copy was not updated. Two stale doc comments repeat the number. It is the first factual claim the product makes, and it is wrong within one click, on a product selling accuracy about the user's own life.
**Fix:** derive it — `` `${questions.length} questions, one at a time` `` — so it can never drift again.
**Suggested command:** `/impeccable clarify`

**[P1] The pipeline summary is the banned pattern, and its numbers don't reconcile.**
Four identical stat cards above the table. `PIPELINE_STAGES` excludes `rejected` (`status.ts:28`) while the proportion bar divides by `applications.length` (`pipeline-summary.tsx:31`), which includes it. The four counts therefore never sum to the row count beneath them, the bars can never reach 100%, and a user's rejections vanish from their own summary with no explanation. For a product whose thesis is evidence over assertion, quietly deleting the bad number is the wrong instinct.
**Fix:** replace four cards with one horizontal segmented funnel — stages as proportional segments with inline counts, `rejected` included as a terminal muted segment or an explicit trailing "· 2 closed". One object instead of four, total visible, table regains primacy.
**Suggested command:** `/impeccable layout`

**[P1] ~170KB of duplicated vendor code loads after first paint.**
CORRECTED AFTER VERIFICATION. Assessment B attributed a +307.6KB post-load jump on
`/dashboard` to 40 RSC prefetches of sibling routes. Measured by request type, that
attribution was wrong: of 277KB arriving after the load event, only **35KB is RSC
prefetch** (`?_rsc=` fetches). The other **241KB is Script** — the app's own deferred
chunks — and **~170KB of that is the known Turbopack duplication**: two byte-equivalent
zod chunks at 64.5KB each plus a 41.5KB motion copy.
**Fix:** `prefetch={false}` on the always-on-screen sidebar and bottom nav is still
correct and shipped (it removes nav-driven prefetch; the residual RSC comes from
in-content dashboard links, which is intent-driven and worth keeping). The dominant
cost is the chunk duplication documented in `next.config.ts`, which is not addressable
from app code.
**Suggested command:** `/impeccable optimize`

**[P2] The coach's primary button is illegible while disabled, and never says why.**
"Continue" measures 2.25:1 light / 2.60:1 dark, label on fill. Disabled controls are exempt from WCAG 1.4.3, so this passes every automated gate including this project's own — but it is the primary action of the assessment, on the screen where an anxious first-timer is least sure they are doing it right, and they cannot read the word blocking them.
**Fix:** lift the disabled label to ≥3:1 and pair it with a persistent "Pick one to continue" hint rather than relying on the disabled state to communicate the requirement.
**Suggested command:** `/impeccable clarify`

**[P3] No security headers.** No CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, HSTS or `Permissions-Policy`; `x-powered-by` discloses the framework. Relevant specifically because the question is deploy-readiness.
**Suggested command:** `/impeccable harden`

## Persona red flags

**Jordan (first-timer)** — the primary persona and the worst served. Cannot create an account at all. Greeted by a stranger's name. Told "Eight questions", counts seven. Can generate and download a cover letter making claims about themselves they never made, with nothing marking it as invented. Coach step 5 shows six checkboxes at the question a career-shifter is least equipped to answer. Cannot read the word on the Continue button blocking them.

**Riley (stress tester)** — mostly defeated, which is a compliment. 2,500 characters into the summary stopped at 2,000. A 58-character unbroken name wrapped across three lines rather than clipping the sheet. Delete gives an `aria-live` undo. **Where Riley wins:** deletes an application, watches the pipeline cards recompute to a total that disagrees with the rows beneath and with the dashboard's own count — two pages, three numbers, one truth. And hits `/sign-in` directly only to be bounced into someone else's dashboard.

**Casey (distracted mobile)** — well served. Zero horizontal overflow on 13 routes at 390px, and B confirmed zero at 320px too. The CV editor swaps to a segmented Edit/Preview toggle rather than stacking panes. **The flaw:** the processing screen holds Casey for a hardcoded six seconds during which nothing is computing, with no skip, on the device most likely to be interrupted.

## Minor observations

- The progress ring turns gold well before completion, spending the colour reserved for *earned* on *waiting*.
- `/cover-letter` at 1280 gives 55% of the viewport to an empty dashed panel with ~350px of dead page beneath.
- The marketing reassurance strip wraps 3+1 at 1280, orphaning the fourth item onto a centred line.
- The `/resume` fixture and the `/documents/cv-northwind` fixture are two different people with the same name (different phone, city, job history).
- The notifications bell can never change state.
- `src/components/shared/coming-soon.tsx` is imported nowhere.
- Settings has no data export or account deletion, while `/privacy` exists and a full CV is written to `localStorage`.
- Settings' Email field is disabled with no explanation.
- "Start Your Career Journey" is the only Title Case button in the product.
- CLS max 0.0422 across 52 loads — well inside threshold. Reduced motion verified: 9 animations / 12 transitions drop to 0/0 under `prefers-reduced-motion`.

## Questions to consider

1. DESIGN.md deleted the achievements screen for being "a hero-metric row above a twelve-tile identical grid". `/applications` is a hero-metric row above a thirteen-row table. If the rule can't be stated in a way that would have caught this one, is it a rule?
2. The gate moved into the services precisely because "a gate that any new screen can forget to call is not a gate." Four services call it; the fifth doesn't. What makes it *possible* for `generate()` to be called ungated — and why isn't the answer to make that impossible?
3. The processing screen waits six seconds for a result already computed. When real inference lands and takes twenty, is the answer a longer ring, or should the skills read-out stream in row by row so the user is reading evidence at second three?
4. Four gated surfaces each wrote their own empty-state copy and all four are excellent. The four pipeline cards share one component and are the weakest thing in the app. Is this team's quality inversely correlated with abstraction?
