# Design (readable notes)

> Narrative companion to the spec-conformant [`DESIGN.md`](./DESIGN.md) (which
> carries the machine-readable token frontmatter + the six fixed sections). Same
> system, prose form — read this for the "why", read `DESIGN.md` for tooling.

Visual system for Levrro. The single source of truth in code is
`src/lib/design/tokens.ts`, projected to CSS/Tailwind by
`scripts/build-tokens.mts`, which enforces a **WCAG-AA contrast gate at build
time** — the palette is provably accessible in both themes or the build fails.

## Direction

Premium, calm, confident — editorial craft over decoration (Linear/Notion
register). The identity is carried by **colour, type, and motion**, never by
decorative gimmicks. Actively steering away from the "generic AI-SaaS" tell:

- **No indigo/violet/fuchsia.** That purple gradient is the saturated AI default
  and is banned here. Levrro's identity is teal + gold.
- Gradient is a brand asset for **solid surfaces** (a CTA band, the logo mark, a
  progress-ring stroke, the aurora backdrop), never a text fill.
- No glassmorphism as a default surface; frosting is rare and purposeful.
- No endless identical icon-card grids; vary layout and hierarchy per section.
- Colour and motion carry meaning. Restraint is the default in the app; the
  marketing landing commits harder to brand expression.

## Brand identity — Deep Teal + Achievement Gold

- **Primary — deep peacock teal** (hue ~195°): intelligent, calm, credible.
  Primary actions, selection, focus, links, brand text.
- **Accent — warm achievement gold** (hue ~80°): momentum, progress, "your
  moment." Gradient terminus, highlights, streaks, achievement/score moments —
  never UI chrome.
- **Brand gradient — teal → aqua → gold.** A cool-competence-warming-to-golden-
  achievement arc; doubles as the aurora sweep on brand surfaces.

## Theme

Light and dark, both first-class. `next-themes` is the single authority (`.dark`
on `<html>`, set pre-paint so there is no flash). Default follows the OS.

- **Light:** near-white surface with a whisper of teal-cool (not warm) so white
  cards lift. Cards are pure white.
- **Dark:** deep teal-ink near-black (not pure black); surfaces step up in
  lightness. Primary is a vivid teal that pops, with dark ink text on it.

## Buttons

- Sizes xs→xl; default a comfortable **36px** (`h-9`), not a cramped 32px.
- **Primary / gradient** carry real depth: soft shadow, a crafted inner top
  highlight via Tailwind v4 `inset-ring` (no focus-ring collision), a hover
  brightness lift, and a `:active` press — never a flat `opacity` fade.
- Every variant keeps default/hover/focus/active/disabled/loading/error states.

## Backgrounds

No screen is ever a flat block of colour:

- **Marketing / auth — `AuroraBackdrop`:** layered CSS wash + drifting glows + a
  low-opacity WebGL `MeshGradient` (`@paper-design/shaders-react`) in teal →
  aqua → gold. Committed brand colour.
- **App — `AmbientBackdrop`:** a restrained, CSS-only counterpart — two faint
  brand glows over a whisper of a top wash, quiet behind dense content. No WebGL.
- Both `fixed`, `aria-hidden`, token-themed, frozen under `prefers-reduced-motion`.

## Motion

Token-driven durations (100–500ms; most UI 150–250ms) and easings. Motion
conveys state, never decoration. **No bounce/elastic:** the `spring` token is a
smooth exponential ease-out (quint), not an overshoot. `prefers-reduced-motion`
honored globally. Library: `motion` (`motion/react`).

## Components & stack

shadcn/Radix primitives + a unified Lucide `Icon` + token-driven `Text`/`Heading`.
**One styling system:** Tailwind v4 + shadcn/Radix + CVA. No Mantine, Theme UI,
or Emotion. Charts standardize on **Recharts**. See `IMPLEMENTATION.md`.

## Layout & Responsiveness

Mobile-first app shell: expandable sidebar (desktop), sticky header, scrolling
content column, bottom nav (mobile). Responsive behaviour is structural, not
fluid typography. Breakpoints xs480/sm640/md768/lg1024/xl1280/2xl1536.
