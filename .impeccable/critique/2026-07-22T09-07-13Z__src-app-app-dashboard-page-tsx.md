---
target: the project quality and progress
total_score: 34
p0_count: 0
p1_count: 2
timestamp: 2026-07-22T09-07-13Z
slug: src-app-app-dashboard-page-tsx
---
# Critique — Levrro (3rd run)

Method: dual-agent (A: design review · B: detector + browser evidence). Target: the project quality and progress.

## Design Health Score — 34/40 (Good, approaching excellent). Held from 34.

(Reviewer headline said 33; its ten component scores sum to 34 — arithmetic slip. Score is flat vs. last round.)

| # | Heuristic | Score | Key issue |
|---|-----------|:---:|-----------|
| 1 | Visibility of System Status | 4 | Skeletons, save-status, aria-live, delta |
| 2 | Match System / Real World | 3 | XP is a number with no real-world referent |
| 3 | User Control & Freedom | 4 | Coach Back/Skip/Edit + undo-on-delete |
| 4 | Consistency & Standards | 4 | Stat-card contrast fix not propagated to buttons/chips |
| 5 | Error Prevention | 3 | Disabled-until-valid; thin field-level errors |
| 6 | Recognition Rather Than Recall | 4 | Icons+labels, echoed answers, visible completed quests |
| 7 | Flexibility & Efficiency | 3 | Enter-to-send, skip link; no command palette/shortcuts |
| 8 | Aesthetic & Minimalist | 4 | Calm, premium |
| 9 | Error Recovery | 3 | Good dashboard error; generic elsewhere |
| 10 | Help & Documentation | 2 | Great inline reasoning; all footer legal links are # |
| Total | | 34/40 | Good, approaching excellent |

## Last round's P1s confirmed resolved (blind review)

Dashboard leads with Today's Mission above the score ("textbook"); card titles use decoupled heading semantics (SR outline); score dip renders calm amber not judging red (Warming-Score Rule implemented literally). Roadmap momentum widget present.

## Anti-Patterns Verdict

Not AI slop (both agree; clears the DON'T gauntlet — no gradient text, bento not identical grids, exponential easing, decoupled headings, real skip-link). Two residual "AI texture" risks (on-brand by doctrine): the gradient rounded-square icon badge recurs on 7 surfaces; the "no screen is ever flat" backdrop maximalism (aurora + mesh + 3 glows + dot texture). Detector: advisory/false-positive (framework #000/rgba, Storybook font-size) + em-dash-overuse warning + real font-size off-ramps (bottom-nav 0.7rem, resume-preview 0.7rem, button sm 0.8rem). Browser: all routes HTTP 200, zero errors, both themes + mobile clean.

## Priority Issues

- [P1] White text/icons on bg-gradient-brand fail WCAG contrast over the aqua+gold half (teal-600 -> aqua-400 -> gold-500; white ~1.8-2:1). Affects the gradient PRIMARY BUTTONS (hero/CTA "Start Your Career Journey", "Start mission") and the feature/how-it-works icon chips (page.tsx:245,282, button.tsx:19 gradient variant). Ironic: stat-card.tsx already fixes this exact issue with a teal-only ramp but the fix was not propagated. Fix: reuse the stat-card teal-only ramp (bg-[linear-gradient(135deg,var(--brand-700),var(--brand-900))]) for icon chips; darken/shorten the gradient-button stops (or teal-only) so the lightest render point clears 4.5:1 with white, or add a scrim. Command: colorize/harden.
- [P1/P2] Dead trust surface: every footer Company/Legal link is # (About, Contact, Careers, Privacy, Terms, Security; page.tsx). No help center; error recovery is generic "Something went wrong." Erodes a cautious first-timer's trust. Fix: wire real routes (or remove until real) + one help/contact entry point. Command: harden/audit.
- [P2] Under-celebrated win: quest completion yields only sr-only text + disabled button (roadmap-view.tsx, quest-detail.tsx); wins silent at rest; the ring's gold terminus is unreachable until ~100 so the signature "gold is earned" emotion is never felt. Fix: tasteful reduced-motion-safe affirmation (gold pulse / +XP·unlock toast). Command: animate.
- [P2] XP is a metric with no meaning (todays-mission, quest-detail, achievement-card). Contradicts momentum-over-metrics; nudges over-gamified anti-reference. Fix: tie XP to readiness points or lead with the concrete unlock. Command: clarify.
- [P2] Mobile nav gap (browser pass): bottom nav has 5 items; Cover Letter, Achievements, Settings have no mobile affordance. Fix: add an overflow/more menu or reconcile.
- [P3] Sidebar 7 primary items (mobile trims to 5); opacity text tones (text-foreground/75-90 hero/coach/sign-in) contradict the no-opacity AA rule. Command: shape/audit.

## Persona Red Flags

- Alex (power user, dashboard): no global search/⌘K/shortcuts (by design); ApplicationsTable has no bulk-select/column-config/saved-views; dashboard cards are read-only (View all only).
- Sam (a11y, dashboard): gradient icon-chip non-text contrast (1.4.11); opacity text on token colors (may dip below AA over the aurora). Credits: role="meter"+aria-label, decorative bars aria-hidden, real skip-link, aria-live.
- Jordan (first-timer, marketing): HeroPreview shows fabricated 68/81/64/52 scores presented as a product shot — an "assertion" the evidence-over-assertion brand disclaims; dead footer legal links; white CTA contrast is the literal first tap.
- Casey (mobile, marketing): GPU-heavy backdrop (mesh gated off low-end, but glows+texture still composite on mid-range while scrolling); gradient CTA dominant on small viewport so its contrast miss is proportionally worse. Credits: bottom-nav trimmed to 5, safe-area padding, clean hero stack.

## Minor Observations

- Today's-Mission top accent h-1 (4px) reads faintly template-y; a hairline would be more Linear.
- score-low/mid/high tokens unused (ring uses gradient, bars use bg-primary) — dead weight or unfinished intent.
- resume-preview hardcodes raw --neutral-500/700/900 (print-invariant paper); neutral-500 on white ~4.5:1 borderline for uppercase headers.
- ProgressRing drop-shadow blur on animated stroke — paint cost on low-end (reduced-motion gated).

## Questions to Consider

1. If "gold is earned," why is gold structurally unreachable on the resting dashboard (ring only reaches gold near 100)? Scarcity, or an unkept promise?
2. Thesis is evidence over assertion, yet the hero's centerpiece is a mocked score card. Preview, or the confident assertion the brand disclaims?
3. Four parallel game loops (XP, Quests, Achievements, streaks) on a tool for anxious adults promised to not feel over-gamified. If you cut one, which?
4. The coach is quiet and the win is silent. Has "calm confidence, not hype" become "no affect at all"? Where is the user allowed to feel good?
