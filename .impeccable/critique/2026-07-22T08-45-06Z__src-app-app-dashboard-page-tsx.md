---
target: the project quality and progress
total_score: 34
p0_count: 0
p1_count: 2
timestamp: 2026-07-22T08-45-06Z
slug: src-app-app-dashboard-page-tsx
---
# Critique — Levrro (re-run after fixes)

Method: dual-agent (A: design review · B: detector + browser evidence). Target: the project quality and progress.

## Design Health Score — 34/40 (Strong), was 31/40 (+3)

| # | Heuristic | Score | Key issue |
|---|-----------|:---:|-----------|
| 1 | Visibility of System Status | 4 | Skeletons, save-status, coach pips, processing screen |
| 2 | Match System / Real World | 4 | Mentor voice; quest/XP on-brand not corporate |
| 3 | User Control & Freedom | 4 | Coach Back/Skip/Edit + undo-on-delete |
| 4 | Consistency & Standards | 3 | Card titles non-semantic divs; some opacity text tones |
| 5 | Error Prevention | 3 | Submit gated on validity; thin form-error evidence |
| 6 | Recognition Rather Than Recall | 4 | Labeled nav, inline quest detail, Why I'm asking |
| 7 | Flexibility & Efficiency | 2 | No command palette / shortcuts / search |
| 8 | Aesthetic & Minimalist | 4 | Restraint is the personality |
| 9 | Error Recovery | 3 | Dashboard error good; generic elsewhere |
| 10 | Help & Documentation | 3 | Reasoning-as-help strong; no broader tooltips |
| Total | | 34/40 | Strong — ship-ready with targeted fixes |

## v1 backlog confirmed resolved (independent blind review)

No purple (No-Purple honored, indigo glow gone); dashboard header now outline (gradient wins hierarchy); dead buttons no longer flagged; a11y fixes held (no skip-link/tablist/nested-progressbar findings; flip-safe chip contrast praised as a strength); marketing avoids fabricated proof by design.

## Anti-Patterns Verdict

Not AI slop (both agree). Passes DON'T gauntlet: no gradient-text, no glass-default, real bento, honest hero preview, earned step-numbers, exponential easing. Detector: all advisory/false-positive (Google-logo colors, framework shadows, Storybook file) + new em-dash-overuse warning (voice, not defect) + 3 minor font-size off-ramp captions (bottom-nav 0.7rem, button sm 0.8rem, resume-preview 0.7rem). Browser: all 10 routes HTTP 200, zero console/page errors, both themes + mobile clean.

## Priority Issues (next layer)

- [P1] Dashboard leads with the metric, not momentum. The 6xl Score is the largest element; Today's Mission stacks 3rd on mobile (after Score + Recent Activity). Ships 4 of 7 PRODUCT.md widgets (missing roadmap progress, heatmap, achievements). Fix: promote Today's Mission / roadmap momentum to lead; reorder mobile DOM; reconcile widget set. Command: distill/craft.
- [P1] Card titles are non-semantic divs (card.tsx CardTitle). Invisible to SR heading navigation; no outline below H1 (WCAG 2.4.10). Fix: route CardTitle through the Heading primitive (level decoupled from size). Command: harden.
- [P2] Negative score delta uses judging red (career-score-card.tsx: destructive-muted/destructive + arrow-right for a drop). Contradicts the Warming-Score Rule on the most anxious widget. Fix: neutral/amber delta, trending-down icon, recovery microcopy. Command: clarify/colorize.
- [P2] Google-only sign-in (sign-in-view.tsx) is a conversion/inclusion dead-end. Fix: add email/magic-link + privacy reassurance. Command: shape.
- [P3] Opacity text tones (text-foreground/60 tabs, sidebar/70, hero/75) contradict the no-opacity AA rule; some risk sub-4.5:1. Plus coach auto-scroll ignores reduced-motion; feature-card hover uses reserved brand-glow; dark "Free to start" low-contrast over aurora. Command: audit/polish.

## Persona Red Flags

- Alex (power user, dashboard): no command palette/shortcuts/search; streak badge hidden below sm; low information density (ring + accordion dominate).
- Sam (a11y, dashboard): card titles not headings; role="meter" on ring inconsistently supported (consider img + aria-label); coach auto-scroll not reduced-motion gated.
- Jordan (first-timer, marketing): single SSO dead-end; hero subtext over the brightest aurora — verify legibility.
- Casey (mobile, marketing): WebGL mesh gated on cores/mem, but a passing mid-tier phone still pays for continuous shader + large blur layers — watch jank/battery.

## Minor Observations

- Feature cards hover to shadow-brand-glow, reserved for committed surfaces (DESIGN.md); demote to shadow-md.
- Today's-Mission 4px top gradient ribbon is the one decorative-stripe accent.
- Dialog title font-medium vs card titles font-semibold — small hierarchy inconsistency.
- resume-preview raw token text-[var(--neutral-500)] bypasses semantic tokens.
- EmptyState border-dashed reads utilitarian vs the premium hairline-ring language.

## Questions to Consider

1. North star is "momentum over metrics," yet the home screen's largest pixel is a metric. Would a quieter Score beside the roadmap step leave an anxious user more confident?
2. Is a red delta ever worth it? You built dead red/amber/green tokens + a warming gradient to avoid judgment, then reintroduced destructive-red on the delta. Should score movement never be rose?
3. Google-only SSO: does the front door quietly filter out the anxious switcher hiding a job search from a work Google identity?
4. Global search was removed "by product design." At what quest/application count does that restraint become friction for retained power users?
