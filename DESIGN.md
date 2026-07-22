---
name: Levvro
description: AI Career Intelligence — turn career uncertainty into a measurable roadmap to getting hired.
colors:
  teal-primary: "#006b6d"
  teal-core: "#008687"
  teal-vivid: "#1aa9a8"
  aqua: "#52c9c6"
  teal-deep: "#035456"
  gold-accent: "#e7a929"
  gold-light: "#f2bb49"
  surface-light: "#f6fbfc"
  surface-dark: "#081214"
  card-light: "#ffffff"
  card-dark: "#131d20"
  sidebar-dark: "#0e181a"
  ink: "#09090b"
  paper-ink: "#fafafa"
  muted-ink: "#52525b"
  border-light: "#e4e4e7"
  success: "#10b981"
  warning: "#f59e0b"
  danger: "#f43f5e"
  info: "#0ea5e9"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "normal"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "normal"
  mono:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "normal"
rounded:
  sm: "0.5rem"
  md: "0.625rem"
  lg: "0.75rem"
  xl: "1rem"
  full: "9999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.teal-primary}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "0 0.875rem"
    height: "2.25rem"
  button-primary-hover:
    backgroundColor: "{colors.teal-core}"
    textColor: "#ffffff"
  button-gradient:
    backgroundColor: "{colors.teal-core}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "0 0.875rem"
    height: "2.25rem"
  button-outline:
    backgroundColor: "{colors.card-light}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0 0.875rem"
    height: "2.25rem"
  input:
    backgroundColor: "{colors.card-light}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 0.75rem"
    height: "2.25rem"
  card:
    backgroundColor: "{colors.card-light}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
---

# Design System: Levvro

## 1. Overview

**Creative North Star: "The Golden-Hour Mentor"**

Levvro should feel like sitting across from a sharp, warm mentor in a calm,
well-lit room — one who tells an anxious job-seeker exactly where they stand and
lights the path forward. The system runs on two colours doing two jobs: a **deep
peacock teal** for calm competence and trust (the room, the light, the voice),
and a **warm achievement gold** for momentum and "your moment" (the progress, the
win). Canonical colour is OKLCH; the hex above is the sRGB projection.

The register is premium, calm, and confident — editorial craft over decoration,
in the Linear/Notion lineage. Identity lives in colour, type, and motion, never
in gimmicks. It explicitly rejects the "generic AI-SaaS" tell (indigo/violet/
fuchsia gradients, glassy cards, gradient-filled text), the cold enterprise HR
portal, the over-gamified job app, and the busy cheap resume-builder. Restraint
governs the product surface; the marketing surface may commit harder to colour.

Every palette value passes a WCAG-AA contrast gate at build time — the design is
provably legible in both light and dark before it ships.

**Key Characteristics:**
- Two-colour identity: teal (trust/competence) + gold (achievement/momentum).
- Dark = teal-ink near-black, not pure black; light = near-white with a teal
  whisper, never a warm cream.
- One typeface (Geist) carried by weight and size contrast, not a pairing.
- No screen is ever flat — a living gradient backdrop on every surface.
- Depth from soft shadows + hairline rings, not heavy borders.

## 2. Colors

A restrained two-hue system: teal carries the brand, gold marks achievement, and
a near-neutral zinc/teal-ink set carries everything else. Status colours are
functional only.

### Primary
- **Deep Peacock Teal** (`oklch(0.478 0.085 196)` / `#006b6d`): the primary
  action, current selection, focus ring, links, and brand text on light. A
  vivid teal (`oklch(0.668 0.11 194)` / `#1aa9a8`) takes the same role on dark,
  where it pops against the teal-ink surface with dark ink text on it.

### Secondary
- **Achievement Gold** (`oklch(0.775 0.15 80)` / `#e7a929`): the warm terminus
  of the brand gradient and the colour of achievement — streaks, the score's
  "your moment", highlight moments. Never used as interactive chrome.
- **Aqua** (`oklch(0.768 0.106 193)` / `#52c9c6`): the luminous midpoint of the
  brand gradient (teal → aqua → gold). Not used as a standalone UI colour.

### Neutral
- **Ink** (`#09090b`) / **Paper Ink** (`#fafafa`): primary text on light / dark.
- **Muted Ink** (`#52525b`): secondary text — must still clear 4.5:1, never a
  light gray "for elegance".
- **Surface** (`#f6fbfc` light / `#081214` dark): the page base — near-white with
  a teal whisper, or a deep teal-ink near-black. Cards step one level
  (`#ffffff` / `#131d20`).
- **Border** (`#e4e4e7` light; translucent white in dark): hairline dividers.

### Functional (status)
- **Success emerald** (`#10b981`), **Warning amber** (`#f59e0b`), **Danger rose**
  (`#f43f5e`), **Info sky** (`#0ea5e9`), each with a tinted `-muted` surface for
  badges and callouts.

### Named Rules
**The No-Purple Rule.** Indigo, violet, and fuchsia are forbidden — that gradient
is the generic-AI-SaaS tell and reads as "an AI made this". Teal is the identity.

**The Gold-Is-Earned Rule.** Gold appears only on achievement and brand moments
(the gradient, streaks, score highlights). It is never a button fill, a border,
or default UI chrome. Its rarity is what makes it read as a win.

**The Warming-Score Rule.** The Career Readiness ring is stroked with the brand
gradient (teal → aqua → gold), so it reads as progress and warmth — never judging
an anxious user with a bar of red.

## 3. Typography

**Display / Body / Label Font:** Geist (with `ui-sans-serif, system-ui,
sans-serif` fallback), self-hosted via `next/font/local`.
**Numeric / Mono Font:** Geist Mono (with `ui-monospace, monospace`), for
tabular figures and scores.

**Character:** One clean, contemporary grotesque doing every job. There is no
display/body pairing — hierarchy comes from weight (400/500/600/700) and a fixed
rem scale, which reads as confident restraint rather than decoration. A distinct
display face for the marketing hero is a sanctioned future swap of the
`--font-heading` slot only.

### Hierarchy
- **Display** (600, `3.75rem`, line-height 1.1, tracking −0.02em): marketing hero
  headline only.
- **Headline** (600, `2.25rem`, 1.15, −0.02em): section headings; `text-wrap:
  balance`.
- **Title** (600, `1rem`, 1.35): card and panel titles (weight, not size, sets them apart from body).
- **Body** (400, `1rem`, 1.5): running copy; cap prose at 65–75ch.
- **Label** (500, `0.875rem`, 1.35): UI labels, buttons, table headers.
- **Mono** (500, `1rem`, tabular): the Career Score number, metrics, streaks.

### Named Rules
**The One-Family Rule.** Geist carries everything. Do not introduce a second
sans; if the hero ever needs more voice, swap the heading slot for a true
contrast face (serif or distinctive display), never a second grotesque.

## 4. Elevation

A soft, premium shadow scale plus a hairline ring for definition; surfaces are
nearly flat at rest and lift on state. Shadows deepen in dark mode. A single
brand glow (`brand-glow`) is reserved for committed brand surfaces (the gradient
CTA, the primary button on hover), not for ordinary cards.

### Shadow Vocabulary
- **xs** (`box-shadow: 0 1px 2px 0 rgb(9 9 11 / 0.04)`): resting inputs, subtle
  outline buttons.
- **sm** (`0 1px 3px 0 rgb(9 9 11 / 0.06), 0 1px 2px -1px rgb(9 9 11 / 0.06)`):
  the primary button, small cards.
- **md** (`0 4px 12px -2px rgb(9 9 11 / 0.08), 0 2px 6px -2px rgb(9 9 11 /
  0.05)`): hovered cards, popovers.
- **lg / xl**: dialogs and floating panels.
- **brand-glow** (`0 8px 32px -8px rgb(0 134 135 / 0.45)` — a teal halo): the
  gradient CTA and primary-button hover only.

### Named Rules
**The Hairline Rule.** Cards use a 1px translucent ring (`ring-foreground/10`),
never a heavy border. Depth is a soft shadow plus that hairline — not a boxed
outline.

## 5. Components

### Buttons
- **Shape:** gently rounded (`0.75rem`, `rounded-lg`); pill only for chips.
- **Primary:** deep teal fill, white text, `sm` shadow, and a crafted inner top
  highlight via a 1px inset ring (`inset-ring-white/15`). Comfortable 36px height
  (`h-9`), `0 0.875rem` padding.
- **Gradient:** the teal→aqua→gold brand gradient with a stronger inset highlight
  and a `brand-glow` on hover — the hero/marketing CTA.
- **Hover / Focus / Active:** hover lifts brightness (~110%), not opacity; active
  presses down 1px and dims ~95%; focus shows a 3px `ring` in the brand colour
  (the inset highlight never collides with it).
- **Outline / Secondary / Ghost:** low-chrome variants on the surface/muted
  colours with `xs` shadow (outline/secondary) or none (ghost).

### Inputs / Fields
- **Style:** card-light background, 1px border (`border-light`), `md` radius,
  36px height.
- **Focus:** border shifts to the teal ring plus a soft brand-tinted ring; never
  a bare browser outline.
- **Error / Disabled:** rose ring + message on error; reduced opacity, no
  pointer, on disabled.

### Cards / Containers
- **Corner Style:** `1rem` (`rounded-xl`).
- **Background:** `card-light` / `card-dark`, one level off the page surface.
- **Shadow Strategy:** hairline ring at rest (see Elevation), `md` shadow on
  hover for interactive cards.
- **Border:** the hairline ring only. **Never nest a card inside a card.**
- **Internal Padding:** `1rem`–`1.5rem` (`spacing.md`–`lg`).

### Navigation
- **Sidebar (desktop):** expandable (16rem / 4.5rem collapsed); items are
  label + Lucide icon. Active item gets a teal left indicator, a filled icon, and
  a muted surface. **Bottom nav (mobile)** mirrors the primary destinations.
- **Header:** sticky, translucent with `backdrop-blur`.

### Signature — Career Readiness Ring
A circular SVG meter stroked with the brand gradient (teal→aqua→gold) over a
neutral track, animating once on mount (respecting reduced motion), with the
score set in tabular mono at its centre. The product's hero visualization.

### Signature — Living Backdrops
`AuroraBackdrop` (marketing/auth: CSS wash + drifting glows + a low-opacity WebGL
mesh) and `AmbientBackdrop` (app: restrained CSS glows). Both fixed, decorative,
theme-aware, and frozen under reduced motion — so no surface is ever flat.

## 6. Do's and Don'ts

### Do:
- **Do** carry the identity in teal + gold, with one Geist family across the UI.
- **Do** keep muted text at ≥4.5:1 — bump toward ink before dropping to gray.
- **Do** use gold only for achievement and brand moments (the Gold-Is-Earned Rule).
- **Do** stroke the Career Score with the brand gradient so progress reads warm,
  not judgemental.
- **Do** give every surface a living backdrop; never ship a flat block of colour.
- **Do** give buttons real depth: inset-ring highlight + soft shadow + brightness
  hover; default height 36px.
- **Do** honor `prefers-reduced-motion` on every animation.

### Don't:
- **Don't** use indigo/violet/fuchsia or a purple gradient — the generic AI-SaaS
  tell (the No-Purple Rule).
- **Don't** ship gradient-filled text (`background-clip: text`); emphasize with
  weight or a solid teal.
- **Don't** look like a **cold enterprise / HR portal** — stiff, gray, joyless.
- **Don't** look like an **over-gamified job app** — badge-spam, confetti,
  cartoon mascots; the quest roadmap and coach avatar stay tasteful and adult.
- **Don't** look like a **crypto/neon-dark** hype page — glow-on-black distrust.
- **Don't** look like a **cheap resume-builder** — busy, ad-heavy, template-picker.
- **Don't** use decorative glassmorphism, side-stripe borders, nested cards, or a
  tiny uppercase tracked eyebrow above every section.
- **Don't** use bounce/elastic easing; ease out with exponential curves only.
