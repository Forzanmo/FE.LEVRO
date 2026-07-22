---
target: the project quality and progress
total_score: 35
p0_count: 0
p1_count: 1
timestamp: 2026-07-22T09-37-33Z
slug: src-app-app-dashboard-page-tsx
---
# Critique — Levvro (4th run)

Method: dual-agent (A: design review · B: detector + browser evidence). Target: the project quality and progress.

## Design Health Score — 35/40 (Excellent, borderline exceptional). Up from 34.

Arithmetic verified: 4+4+3+4+3+4+3+4+3+3 = 35.

| # | Heuristic | Score | Key issue |
|---|-----------|:---:|-----------|
| 1 | Visibility of System Status | 4 | Skeletons, toasts, delta, live ring |
| 2 | Match System / Real World | 4 | Mentor voice; Quest/XP flirts with gamey register |
| 3 | User Control & Freedom | 3 | Quest complete is irreversible (no undo/confirm) |
| 4 | Consistency & Standards | 4 | Single token source, one type family |
| 5 | Error Prevention | 3 | Gated submits; one-click irreversible quest complete |
| 6 | Recognition Rather Than Recall | 4 | Completed quests visible, Next surfaced, labeled nav |
| 7 | Flexibility & Efficiency | 3 | No command palette / search |
| 8 | Aesthetic & Minimalist | 4 | Crown jewel — calm, momentum-first |
| 9 | Error Recovery | 3 | Good dashboard error; generic message |
| 10 | Help & Documentation | 3 | Strong contextual help; no concept tooltips |
| Total | | 35/40 | Excellent, borderline exceptional |

## Verified: last round's fixes landed (independent blind review)

B: all primary CTAs solid dark-teal, white text legible (contrast P1 fixed); button font-size off-ramp no longer flagged; heatmap reads low->high in both themes. A: no purple, gold reserved, footer clean, quest-complete celebration is "a well-placed peak, tasteful, adult, not confetti-spam." Verdict: NOT AI slop — "close to reference-quality anti-slop work."

## Priority Issues (all polish-level, not rescue)

- [P1] Resume mobile edit/preview toggle fakes the ARIA tabs contract (role=tablist/tab, no arrow-keys/aria-controls/tabpanel) in resume-view.tsx. Achievements got this right (role=group + aria-pressed, the harden fix); resume-view fell into the same trap. Fix: align resume-view to the achievements button-group pattern. Command: harden.
- [P2] Dashboard two competing next-actions: header "Continue AI Coach" (outline) vs "Start mission" (gradient). Milder since the demote, but reviewer wants one unambiguous primary. Command: distill.
- [P2] Quest completion has no undo (roadmap-view celebration toast), inconsistent with Applications delete-with-undo. Fix: add action:{label:'Undo'} to the completion toast. Command: harden.
- [P2] Opacity-muted text over the living backdrop (text-foreground/75-90 over aurora) risks dipping under AA — the unpredictable-contrast case DESIGN.md warns against. Fix: gated muted-foreground tokens / contrast floor. Command: audit.
- [P3] XP/Level density brushes the over-gamified anti-reference on the most-seen surface (dashboard mission). Fix: drop XP from Today's Mission; reserve for roadmap/achievements. Command: clarify.

## Persona Red Flags

- Alex (power user): no command palette/search; heatmap has no keyboard drill-down (per-day only in title hover); two competing header CTAs.
- Sam (a11y): heatmap cells aria-hidden, per-day hover-only (defensible, GitHub-style); verify streak badge + text-foreground/7x tones clear 4.5:1 in both themes. Credits: score bars aria-hidden, ring is a proper meter, skip link.
- Jordan (first-timer): "Free to start — no credit card" never locates the paywall — an anxious user may fear the resume is gated at the end.
- Casey (mobile): quest tree min-w-[26rem] forces horizontal scroll below ~416px; marketing itself is clean.

## Minor Observations

- Modal scrim bg-black/10 is very light on light theme; consider /15-/20.
- Card overflow-hidden may clip focus rings/tooltips at card edges on interactive cards.
- TodaysMission top stripe h-1 (4px) reads heavy for a hairline; 2px more Linear.
- DialogTitle font-medium/leading-none vs CardTitle font-semibold/leading-snug — title primitive inconsistency.
- resume-preview hardcodes primitive vars (print-invariant, per comment); confirm --neutral-500 on white clears 4.5:1 (~4.6 borderline).
- Mobile: Roadmap/Applications (top-right on desktop) stack at the very bottom (B).

## Questions to Consider

1. North star is momentum over metrics — is the 184px score ring still the gravitational center, or does Today's Mission truly win hierarchy?
2. The Warming-Score Rule never shows red — is never showing a hard number its own confidence trick, in tension with evidence over assertion?
3. XP/Level toward what? If Level 3 earns nothing external to getting hired, does the mechanic serve the anxious adult or engagement metrics?
4. "Free to start" — locate the wall. State the pricing boundary up front, as the honesty principle demands of any other claim.
