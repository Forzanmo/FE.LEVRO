---
target: post-refactor full product
total_score: 30
p0_count: 0
p1_count: 0
timestamp: 2026-07-29T19-29-52Z
slug: post-refactor-full-product
---
Method: dual-agent (A: design review `a4d4c76cf2798343a` · B: detector + runtime `a63ad45835f88b36b`)

Target: full product after the eight-workstream refactor.
Evidence: bundled `detect.mjs`, `tsc`, `eslint`, token gate, production build, `check:contrast` (rendered pixels), Playwright runtime capture across 8 routes × 2 themes × 2 viewports, axe-core sweep.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | `aria-live` used correctly throughout; skeleton shape now matches the loaded page |
| 2 | Match System / Real World | 3 | Fabricated pre-assessment score removed; coach skill options still hardcoded to software engineering |
| 3 | User Control and Freedom | 3 | Back/Skip/Edit/Save-&-exit/Resume; "Start over" still destroys a saved session without confirmation |
| 4 | Consistency and Standards | 3 | All four sticky surfaces now opaque; `measure` still only adopted on marketing/legal |
| 5 | Error Prevention | 3 | Question-set fingerprint check on resume; no confirm on "Start over" |
| 6 | Recognition Rather Than Recall | 3 | Reasoning disclosure, full transcript, per-category evidence |
| 7 | Flexibility and Efficiency | 3 | Native form semantics, skip link, collapsible sidebar |
| 8 | Aesthetic and Minimalist Design | 3 | Three distinct section forms; landing's first fold unchanged |
| 9 | Error Recovery | 3 | Settings toast now reports real persistence; storage quota failures still silent |
| 10 | Help and Documentation | 3 | Contextual reasoning; honest legal placeholders |
| **Total** | | **30/40** | **Good** — up from 22/40 |

## Verified Outcomes

- **1,378 / 1,378 text runs pass WCAG AA** across 12 routes × 2 themes × 2 viewports, measured from rendered pixels
- **0 axe violations** across 8 routes × 2 themes (was 7 rules including 1 critical, 4 serious)
- Token gate: 39 pairs × 2 themes, plus emitted-CSS well-formedness assertion
- `tsc` clean, `eslint --max-warnings 0` clean, production build 17/17 routes static
- 0 console errors, 0 page errors, no horizontal scroll at 390px on any route

## Fixed in the re-critique pass

P0 — the first-run gate keyed on `scoreRevealedAt` alone, so a brand-new visitor was shown a Career Readiness Score of 68 with fabricated evidence. Now requires `assessmentCompletedAt !== null`, and the dashboard renders a real pre-assessment state.
P1 — score ring was still non-monotonic (measured gold at 180°, teal at the leading edge for a 90). Replaced with a solid stroke mixed teal→gold by value.
P1 — `<Reveal>` divs inside `<dl>`/`<ol>` broke list semantics (4 serious axe violations, introduced by the landing redesign).
Critical — unnamed status-filter combobox on `/applications`.
P1 — `app-header` was the one sticky surface missed at `/60`.
P1 — settings reported "Profile saved" with no persistence call.
Plus: score-reveal destination, roadmap clipping at 390px, heading order, empty table header, dashboard/roadmap quest-total mismatch, hydration race on the greeting.

## Known remaining (not blocking)

- Landing's first fold is still the category-default hero sequence; gold barely appears above the fold
- `measure` variant adopted on marketing/legal only
- "Start over" in the coach has no confirmation
- localStorage quota failures are swallowed silently
- `seedReturningUser()` still bypasses the real first-run funnel by default
- Legal pages are honest placeholders, not real legal copy
