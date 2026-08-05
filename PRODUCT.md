# Product

<!-- The `## Register` section was removed: the brand/product register axis it
encoded is no longer read by tooling, having been replaced by per-surface visitor
modes. The distinction it described still holds and is worth stating plainly:
the authenticated app is the bulk of the experience and is designed as a tool
that serves the task, while the public marketing routes (the homepage `/` and any
future about/pricing/blog) are a surface where the design IS the product. Choose
per surface, from the surface in focus. -->

## Platform

web

## Users

Levvro's users are juniors early in their careers and career shifters moving into a
new field — consumer job-seekers, usually facing their first serious job hunt on
their own. They arrive uncertain and often anxious: unsure what to fix, what
recruiters want, or whether they're ready. Their context is high-stakes and
time-pressed — they're doing this around a job, studies, or life. The job to be done
is to become genuinely recruiter-ready and start landing interviews, with a clear
sense of progress along the way. Success is a user who becomes measurably more
employable — and ultimately hired — able to say: "This is the first AI career product
that actually made me confident to go through a real interview."

## Product Purpose

Levvro turns career uncertainty into a clear, evidence-backed path toward getting
hired. Rather than starting by generating a CV, it starts with an AI coaching
conversation to understand the person and assess where they stand, then shows exactly
which skills their CV proves and which it does not — each verdict with its reasoning
attached. From that assessment it produces the recruiter-ready assets — CV and cover
letter — at the right stage of the journey rather than up front.

Levvro exists because the path to "hired" is invisible and overwhelming, and the
market is full of tools that make documents look better without making candidates more
hireable; Levvro makes the path legible, evidence-based, and paced so the user never
wastes time.

### Shipping today

The product's home is the dashboard, which brings together the skills-coverage
read-out (what the documents prove, gaps first, each with its evidence), the AI Coach,
the document library, recent activity, and job applications. Success looks like
movement a user can see: gaps closing, documents produced from real evidence, and
users who land interviews and offers.

### Planned — not built, do not describe as present tense

These are the product's intended direction. Nothing in the UI may promise them, and no
copy may imply they exist today. This section is deliberately separate because both
were once described here as shipped, and the sign-in screen went on selling the score
for months after it was removed from the code.

- **Career Readiness Score.** A single transparent score with detailed reasoning
  across skills, projects, CV quality, communication, and portfolio. The
  skills-coverage card is the current, narrower answer to the same question; the score
  is meant to sit above it, not replace it.
- **Interactive roadmap.** A personalized sequence that coaches the user forward one
  focused step at a time, and the mechanism the dashboard's "next step" affordance
  should eventually route into. Until it exists, the dashboard closes gaps by linking
  directly to the coach and the CV editor.
- **Achievements.** Removed along with the roadmap that fed it, and worth rebuilding
  only alongside it — a badge wall with no progression behind it reads as the
  gamification this product's anti-references rule out.

## Positioning

The AI career product that makes you interview-ready by showing you exactly what to
fix and proving why — coaching, not just a CV generator. Every screen reinforces
evidence-driven progress: the gap, the reasoning, the next step — never vague
encouragement.

## Brand Personality

Trustworthy, premium, and intelligent — with genuine warmth. The register of Notion
and Linear, valued specifically for their craft: the pixel-level polish and restraint
that make a tool feel serious and worth trusting. The voice is a knowledgeable mentor
who respects your time — encouraging but never fluffy, always explaining its
reasoning, never hyping and never hallucinating, never condescending. Emotionally,
every interaction should leave an anxious first-time job-seeker feeling confident and
motivated, certain they have a clear path and can walk it. Calm authority over
excitement; earned trust over persuasion.

## Anti-references

Levvro must not look or feel like any of these:

- Generic AI-SaaS — purple gradient blobs, glossy glass cards, gradient-filled text,
  endless identical icon-card grids, the default "an AI made this" look.
- Enterprise/corporate — stiff, gray, dense, joyless admin panels.
- Gamified/childish — cartoon mascots, confetti spam, badge overload that undercuts
  credibility. The quest roadmap and robot coach avatar must stay tasteful and adult.
- Crypto/neon-dark — glow-heavy neon-on-black hype that reads untrustworthy for
  something as consequential as a career.
- Cheap resume-builder sites — busy, ad-heavy, template-picker interfaces (the
  Zety / Canva-resume register). Levvro assesses and coaches toward getting hired;
  it is not a template gallery.

The needle to thread: premium and human, closer to editorial/Linear/Notion craft
than to any of the above.

## Design Principles

Evidence over assertion. Every score, suggestion, and state shows the reasoning
behind it; trust is earned through transparency, not confidence tricks.

Never waste the user's time. One primary goal per screen; guide rather than
overwhelm; every action gets immediate, legible feedback. Momentum over metrics —
progress and the next step lead, and raw numbers serve that story rather than
becoming the point.

Reduce uncertainty. Make the invisible path to "hired" measurable and concrete — the
user should always know where they stand and what to do next.

Calm confidence, not hype. Restraint over decoration; color and motion carry meaning,
never noise. Craft is the trust signal: for an anxious user deciding whether to trust
their career to this tool, pixel-level polish reads as competence. This is the direct
counter to the AI-SaaS and crypto anti-references.

Human, not robotic. Warmth and encouragement without gimmicks — the counter to both
enterprise coldness and childish gamification.

## Accessibility & Inclusion

Target WCAG 2.2 AA across the whole product: body text at ≥4.5:1 contrast (≥3:1 for
large text), full keyboard navigation with visible focus, correct ARIA semantics and
screen-reader support, and honored `prefers-reduced-motion`. High-contrast-friendly
palettes in both light and dark themes. Beyond the standard, hold a deliberately low
cognitive-load bar: because the users are stressed, first-time job-seekers, screens
should present one primary task at a time, keep hierarchy calm, and use plain
language — minimizing the mental effort required to make progress.
