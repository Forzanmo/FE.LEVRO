---
target: the project quality and progress
total_score: 31
p0_count: 0
p1_count: 2
timestamp: 2026-07-22T07-59-53Z
slug: src-app-app-dashboard-page-tsx
---
# Critique — Levrro (project quality & progress)

Method: dual-agent (A: design review, source · B: detector + browser evidence, live). Target: the project quality and progress.

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|-----------|:-----:|-----------|
| 1 | Visibility of System Status | 3 | Excellent skeletons/coach progress, but the two loudest CTAs are dead (no handler) |
| 2 | Match System / Real World | 3 | Mentor voice & plain language; XP/Quest/Mission game jargon creeps toward the anti-reference |
| 3 | User Control & Freedom | 3 | Coach Back/Skip/Edit strong; sign-out has no confirm |
| 4 | Consistency & Standards | 4 | Rigorous token single-source-of-truth; one button/card/ring system |
| 5 | Error Prevention | 3 | Disabled-until-valid coach submits; few real forms |
| 6 | Recognition Rather Than Recall | 3 | Labeled nav, active states, collapsed-rail tooltips |
| 7 | Flexibility & Efficiency | 2 | No command palette, keyboard shortcuts, or search |
| 8 | Aesthetic & Minimalist | 4 | Standout — calm Linear/Notion register genuinely achieved |
| 9 | Error Recovery | 3 | Dashboard error state exemplary; generic elsewhere |
| 10 | Help & Documentation | 3 | Score-reasoning accordion + "Why I'm asking" contextual help; no tour |
| Total | | 31/40 | Good (top of normal band, approaching excellent) |

## Anti-Patterns Verdict

No — deliberately not AI slop. System-level anti-slop discipline: exponential-only easing, hairline-ring depth, "never nest a card," and the empathetic Warming-Score ring (teal->gold, never red). Gradient-text and glassmorphism utilities exist but are used nowhere.

The one real slop artifact: the brand-glow shadow still ships rgb(99 102 241 / .45) = #6366f1 indigo-500 (tokens.ts:349,357; tokens.generated.css:178,243), the generic-AI-SaaS purple the palette moved away from. Comment says "tuned to teal"; value never was. Tints every premium glow across 6 files (logo, gradient-button hover, brand stat chip, achievements). One-line fix.

Deterministic scan (detector): all advisory, no errors. Flags: gradient-text on the unused .text-gradient-brand utility (both assessments agree -> delete), three real off-scale font-sizes (0.7rem bottom-nav & resume preview, 0.8rem button sm). False positives: four Google-logo colors in google-button.tsx, a Storybook .stories font-size. Detector did NOT catch the indigo glow; the design review did.

Browser evidence (screenshots, no overlay): every route HTTP 200, zero page/console errors, both themes + mobile, no overflow/low-contrast. Live-only catches: Coach screen has a large blank vertical band (question top, options bottom); /onboarding redirects to /dashboard under mock session (expected).

## What's Working

1. Anti-slop discipline that holds — Warming-Score ring's refusal to show red, exponential easing, hairline depth. Empathy encoded in the system.
2. The AI Coach flow — one question at a time, reasoning-on-demand, Back/Skip/Edit, focus management, aria-live log.
3. Token governance — single OKLCH source of truth, WCAG-gated at build, muted text held at AA not faded to illegible gray.

## Priority Issues

- [P1] brand-glow shadow ships indigo (#6366f1). The banned AI-purple, live on every premium glow. Fix: retune to oklch(0.478 0.085 196 / .45) (or color-mix off --brand); regenerate tokens. Command: colorize.
- [P1] Dashboard has no single focus. Two competing gradient CTAs (Continue AI Coach vs Start mission); Career score + Interviewing/Offers each render twice. Violates one-primary-goal-per-screen. Fix: make Today's Mission the single hero; drop duplicate stat tiles; fill freed space with non-duplicative signals. Command: distill.
- [P2] Dead primary buttons. Continue AI Coach + Start mission have no onClick/href. Fix: wire to routes, use isLoading. Command: harden.
- [P2] Accessibility gaps. progressbar nested inside accordion trigger button (invalid ARIA, from the premium pass); achievements fake tablist without arrow keys; no skip link (7-item sidebar tabbed every load); brand stat chip white icon on gold gradient terminus <3:1. Command: audit then harden.
- [P2] Marketing has zero proof at the highest-stakes moment. No testimonials/outcomes/trust signal; "See how it works" links to feature cards not a process. Fix: proof band + real assess->coach->hired walkthrough. Command: onboard.

## Persona Red Flags

- Alex (power user, dashboard): no command palette/shortcuts/search; recent-activity items inert text not links; two competing dead CTAs.
- Sam (accessibility, dashboard): progressbar inside a button; brand chip white-on-gold <3:1; no skip link; 7-deep sidebar tabbed every load.
- Jordan (first-timer, marketing): "See how it works" promises process, delivers cards; hero "68" reads as "is that my score?"; footer links mostly #.
- Casey (one-handed mobile): WebGL aurora runs continuously (gated by reduced-motion, not device capability); "Get started" top-right, hard to thumb-reach. Hero CTAs h-12 thumb-friendly.

## Minor Observations

- Coach layout: blank vertical band between question and options; needs vertical centering. Command: layout.
- Spec drift: Input h-8 (32px) vs buttons h-9 (36px) and DESIGN.md 36px; CardTitle text-base where DESIGN.md §3 says 1.25rem/600.
- Two dead utilities (text-gradient-brand, surface-glass): use intentionally or delete.
- XP/Quest/Mission language tasteful today but thin edge of over-gamified anti-reference.

## Questions to Consider

1. If the Career Score is the signature, why does its home screen render it twice?
2. The Warming-Score ring never shows red. For an honest 34, is a gold-tipped ring reassurance or dishonesty?
3. Every anxious first-timer asks "has this gotten anyone hired?" — answered nowhere. Why isn't proof the hero?
4. The one purple in the system hid in the glow annotated "tuned to teal." How many other "tuned to X" comments hide an un-tuned value?
