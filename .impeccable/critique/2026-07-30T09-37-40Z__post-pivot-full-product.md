---
target: post-pivot full product
total_score: 25
p0_count: 2
p1_count: 6
timestamp: 2026-07-30T09-37-40Z
slug: post-pivot-full-product
---
Method: dual-agent (A: design review, 17 routes x 2 themes x 2 viewports, state-seeded · B: detector, build, static analysis, bundle graph)

Evidence: token gate 42 pairs x 2 themes · build 15 routes · check-a11y 68 renders 0 violations · check-contrast 2080/2080 clear AA, 0 unexpected redirects

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Template choice gives no save feedback and does not persist; notifications bell permanently "You're all caught up" with no notification source |
| 2 | Match System / Real World | 2 | "Apps" for job applications; "New CV" opens the existing CV; `CVs`+uppercase renders "CVS"; sign-in advertises the deleted score; "Download PDF" fires window.print() |
| 3 | User Control and Freedom | 3 | Coach promises "skip any answer"; only 3 of 8 are optional. Experience-role delete is irreversible with no confirm |
| 4 | Consistency and Standards | 2 | Two committed-brand-surface recipes; four labels for one destination; two persistence models; two destructive-action patterns; DocumentSheet unused while 3 sites hand-copy it |
| 5 | Error Prevention | 2 | Template trade-off disclosure is the best instance in the product — and the choice is then silently discarded on navigation |
| 6 | Recognition Rather Than Recall | 3 | Status badges hidden on mobile; Cover Letter and Achievements absent from mobile nav; 3 unlabelled header icons |
| 7 | Flexibility and Efficiency | 2 | No search/filter in the document library; mandatory 6s wait; unskippable coach; Google-only auth |
| 8 | Aesthetic and Minimalist | 3 | /achievements card grid; cream aurora cast; persistent void bottom-right; 2 nested-card instances |
| 9 | Error Recovery | 3 | Genuinely good: plain language, reassurance, retry, escape route preserved in the error branch |
| 10 | Help and Documentation | 2 | "Why I'm asking" is real help; no help centre, no in-app contact, Terms/Privacy unreachable from the app |
| **Total** | | **25/40** | **Acceptable** — significant improvements needed |

Cognitive load: 4 of 8 failures -> high. Populated dashboard has four read-only cards and zero primary actions.

## Anti-patterns verdict

First-order reflex: PASSES. Deep peacock teal + gold is not guessable from "AI career tool"; no purple anywhere.

Second-order: FAILS. "AI career tool that isn't SaaS-purple" -> the tier-two lane is exactly deep-teal/forest + warm gold, one grotesque, soft shadows, Linear/Notion as the named reference. Rescued partly by three structural decisions: the hero product shot is a DOCUMENT not a dashboard; the three landing body sections take three genuinely different forms; the template picker discloses its own downside.

Detector: 1 advisory finding across all of src/ (icon.stories.tsx:46 `text-[0.6rem]`). Nothing suppressed — verified against --no-config, no ignore rules, no inline disables.

Bans: clean on gradient text (0 bg-clip-text), glassmorphism (backdrop-blur only on 2 sticky bars, both opaque-floored), numbered-section scaffolding (one genuine sequence, textbook exception), text overflow (none at 390 or 1280), bounce easing.

VIOLATED:
- /achievements is the identical-card-grid ban verbatim — 12 cards, each size-12 icon chip + heading + one line
- Hero-metric template x3, crystallised into a primitive (stat-card.tsx)
- Nested cards x2 (document-detail-view.tsx:174, resume-editor.tsx:94) against DESIGN.md's explicit rule
- Cream/sand body bg BY COMPOSITE: aurora gold at 7% in base wash + 11-15% glows over near-white = cream on /sign-in, /onboarding, /terms
- Tiny uppercase tracked labels in 5 flavours, one baked into choice-group.tsx:89

## Priority issues

[P0] Sign-in sells a deleted feature. sign-in-view.tsx:16 "A measurable Career Readiness Score in minutes". Also :41 "build your career readiness", :57 "your plan". settings-view.tsx:140 "your next quest". registry.ts:77 dead `roadmap` icon. Found independently by both assessors. Conversion screen, on a product whose first principle is "trust is earned through transparency, not confidence tricks".
Fix: rewrite the three value props to the shipped product; grep readiness|score|plan|quest|roadmap across src/; update PRODUCT.md in the same pass.

[P0] The gates have a hole. tsconfig excludes `e2e` and `**/*.stories.tsx`; lint runs on `src scripts`. So e2e/ and all 14 story files are checked by NOTHING — and that is where residue survived. e2e/roadmap.spec.ts targets the deleted route entirely; smoke.spec.ts has 3 of 5 tests asserting deleted content ('roadmap to getting hired', 'Start Your Career Journey', getByRole('meter')).
Fix: add e2e + stories to a typecheck project and to the lint scope, then repair the specs.

[P1] `warning` and `achievement` are the same colour. Light: warning-muted oklch(0.9869 0.0214 95.28) vs achievement-muted oklch(0.985 0.02 92). Dark: warning oklch(0.8369 0.1644 84.43) vs achievement oklch(0.822 0.142 82). Five near-identical amber pills on the dashboard meaning both "5-day streak, well done" and "Thin". DESIGN.md:185-188 claims this was fixed — it ships colliding.
Fix: move warning to hue ~40 (orange-red); add an INTER-ROLE DISTINCTNESS assertion to the token gate. A contrast gate structurally cannot catch two roles being too similar to each other — new blind spot for VERIFICATION.md.

[P1] Gold-Is-Earned inverted, and it produced the cream AI tell. Decorative gold on 100% of surfaces: aurora-backdrop.tsx:46 (gradient-to at 7% in base wash), :60-67 (11-15% glow), ambient-backdrop.tsx:39-46 (every authenticated screen), logo.tsx:39. Earned gold in light mode is achievement = oklch(0.502 0.098 68) — brown. Gold is wallpaper everywhere and mud where something was earned.
Fix: remove gradient-to from the aurora base wash; delete the gold glow from AmbientBackdrop; give earned state real gold (accent-200/300 chip with accent-900 text clears AA and looks gold); keep only the hero lamp.

[P1] Dashboard diagnoses, never prescribes. Four cards, three read-only, zero primary actions. Lead card opens with three failures and a subhead that is a 40% score in prose. Removing the score HELPED diagnosis (five reasoned verdicts beat one composite) and HURT prescription — the roadmap said what to do next and nothing replaced it. Motivation was back-filled with WEAKER instruments: "270 XP" and "5-day streak" are two opaque numbers with LESS reasoning than the score had. PRODUCT.md still lists "know where they stand and what to do next".
Fix: give every non-strong skill row a concrete action in its expanded content; lead the page with one derived next thing.

[P1] Cover Letter and Achievements unreachable on mobile. navigation.ts:30-39 ships 5 items omitting both; app-header.tsx has no hamburger/drawer/overflow. /cover-letter has ONE inbound link in the app (from an existing cover-letter doc, so you can edit one but never create one); /achievements has zero. A cover letter is half of what the landing page promises.
Fix: 4 items + a "More" sheet; add "New cover letter" to /documents.

[P1] Coach's final question is a fake choice and re-asks onboarding. coach-service.ts:94-103 offers 'Resume + Cover Letter' / 'CV + cover letters' — same deliverable twice, one using the noun navigation.ts claims was standardised away. Onboarding already asked this.
Fix: delete the plan question; spend the slot reflecting an answer back. Make 'none' mutually exclusive in the evidence multi-select.

[P1] Experience-role delete destroys typed work with no confirm and no undo (resume-editor.tsx:97-105), while applications delete offers optimistic + Undo toast. The weaker safeguard guards the more valuable data.

[P2] "One shared document sheet" is one unused abstraction plus three copies. DocumentSheet has ZERO consumers; class string hand-copied at cv-templates.tsx:31 and cover-letter-preview.tsx:10; page.tsx:147 uses a different radius AND shadow. The landing hero's product shot does not share corners or shadow with the CV it advertises. SHEET_INK imported only by the marketing page; CV templates inline text-[var(--neutral-700)] 12 times.
Also: Designer template drops bullet markers entirely, so highlights render as unmarked stacked sentences.

[P2] Template choice not persisted, and the editor ignores it. document-detail-view.tsx:82 holds it in useState; no useMutation anywhere in src/. Selecting ATS then editing and exporting silently ships Minimalist. Exactly the failure the picker's copy exists to prevent.

[P2] The drenched fold is not a fold. page.tsx:236 sizes by padding with no min-h — teal ends at ~654px of a 900px viewport. The asymmetry is a two-column split; nothing crosses a gutter or bleeds an edge. The gold "lamp" lands above the sheet, not behind it, compositing to olive. HERO_SKILLS shows 2 of 3 evidenced — a flattering picture beside a headline claiming the opposite.

## Bundle facts (B)

- Turbopack emits duplicate copies of zod and motion; /coach carries private duplicates of both = ~103 KB gzip pure duplication, heaviest route at 430 KB. Cause: coach-storage.ts imports zod to validate a localStorage blob.
- Clerk ships 50 KB gzip to 14 of 15 routes including /terms and /privacy; auth-provider.tsx guards mounting but not bundling, and with no key configured it never executes.
- 316 KB gzip floor on static legal pages (all providers wrap every route).
- /applications prerenders 122.5 KB of HTML (react-table renders the full mock dataset server-side).
- recharts and dayjs are UNUSED production dependencies. @storybook/test unused, pinned v8 against Storybook 10.
- 10 orphaned files incl. the entire lib/api/http-client.ts. 20 of 62 registry icons unreferenced and un-shakeable (object literal).

## Strengths

1. The template picker discloses its own cost at the point of choice. Positioning executed as an interface decision, not copy. Almost no resume product tells you the pretty template might cost you the interview.
2. The skills card is a better instrument than the score it replaced, and knows why — gaps sorted first, every row expanding to its reasoning, meaning carried by text with colour as reinforcement.
3. State coverage is real design work: back link survives the error branch by design, 0/0/0 replaced with prose, deletes offer Undo instead of a confirm dialog, skeletons carry role=status + aria-live.
4. The theme-invariant document sheet is the right call — print-color-adjust: exact so the Designer sidebar does not print blank.

## Notable minor

"CVS" (pharmacy) from CVs+uppercase. "1 Offers" hardcoded plural. Pipeline tiles sum to 12 while the table shows 14 rows. "Offer" wears success-green while "Sent" wears achievement gold — the least significant completion gets the achievement colour. Coach promises "skip any answer" on question 1 where no Skip renders. 6s artificial wait against a "never waste your time" principle. Terms/Privacy linked only from /sign-in. Marketing footer links four authenticated routes and says "Resume" where the app says "Edit CV". Four labels for one destination. Designer renames the user's "Summary" to "Profile".

## Trend

22/40 (initial) -> 30/40 (self-assessed, not independently verified) -> 25/40 (independent). The 25 is more credible than the 30.
