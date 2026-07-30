---
name: Levvro
description: AI Career Intelligence — see what your CV actually proves, and fix what it doesn’t.
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
  of the brand gradient and the colour of completion — a sent document, a
  streak, the lamp behind the hero's CV. Never used as interactive chrome.
  Exposed as the `achievement` / `achievement-foreground` / `achievement-muted`
  roles. Gold needs opposite ends of its ramp depending on the surface: the role
  resolves to a dark `accent-800` on light backgrounds, and
  `brand-surface-accent` (`accent-300`) is the separate role for gold ON the
  committed brand surface, where the dark value measures 2.53:1.
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

**The Gold-Is-Earned Rule.** Gold means **done**, and nothing else: a sent
document, a streak, the lamp behind the hero's CV. It is never a button fill, a
border, a to-do marker, or default UI chrome. Its rarity is what makes it read as
a win. Amber (`warning`) means warning.

**The Filled-Is-Earned Corollary.** Separating the two by hue alone does not
work and telling people to try harder did not fix it: in light mode `warning`
resolves to amber-700 and `achievement` to gold-800, two dark warm values a pixel
apart, so a filled amber "Thin" chip and a filled gold "5-day streak" chip on the
same dashboard were the same object meaning opposite things. This rule was
already recorded as fixed once and the collision came back, which is the evidence
that a hue rule is not enforceable by eye.

So the distinction is **shape**: a **filled warm** pill means earned; a warm pill
that is **outlined** is a status or a warning. Skill strength is outlined across
its whole set (border + text keep the hue, the dot reinforces it), so the set
reads as one taxonomy; the "Sent" document badge stays filled gold, because it is
the completion this rule exists to protect.

Cool and neutral chips — the document `draft`/`ready` states, the whole
applications pipeline — are outside this: they cannot be mistaken for gold, so
they keep their filled treatment. The rule is about the warm band only. Adding a
new warm chip anywhere means deciding which side of it you are on.

**The Committed-Surface Rule.** A fold that IS the brand — the marketing hero and
its header, the CTA band, the Designer CV sidebar — uses the `brand-surface`
role, which is **identical in light and dark**. A hero that inverts with the
theme is not committed to a colour. Because the surface never changes, its
foreground can be fixed at white and proved once. Never hardcode a brand shade
for these; three surfaces each having their own was how "the brand colour" ended
up with three different values.

**The Paper Rule.** Documents (CVs, cover letters, and the landing hero's product
shot) render on one shared theme-invariant sheet — `SHEET_SURFACE` in
`components/documents/document-sheet.tsx`. A CV gets printed and emailed, so it
must look identical regardless of app theme. This is the one place where
bypassing the semantic colour layer is correct, and it is bypassed in exactly one
file so no call site has to decide.

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
- **Mono** (500, `1rem`, tabular): metrics, counts, dates, and the numbered steps on the marketing page.

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
- **Header:** sticky and **opaque** (`/92`, or `/85` where backdrop-filter is
  supported). Sticky bars are never more translucent than that: a translucent bar
  composites over whatever happens to be scrolling beneath it, so its contrast is
  unknowable and cannot be proved. The same floor applies to the mobile bottom
  nav and the coach composer.

### Choosing from options
One mechanism, product-wide: `components/ui/choice-group.tsx`. A real
`<fieldset>` + `<legend>`, native `<input type="radio"|"checkbox">`, and one
`has-[:focus-visible]` convention — so arrow-key roving, space-toggle, form
semantics, and "radio, 2 of 3" announcements come for free. The coach's answers,
the onboarding plans, the theme picker, and the CV template picker all use it;
each supplies only its own layout. **Never** use `aria-pressed` buttons for a
mutually-exclusive choice — that announces N independent toggles.

`role="group"` + `aria-pressed` **is** correct for view filters (the CV
edit/preview toggle), which change what you are looking at rather than picking a
value.

### Signature — The document sheet
Every CV and cover letter renders on one shared white sheet (the Paper Rule
above), in one of three structurally different templates:
**Minimalist** (single column, type hierarchy only), **Designer** (tinted
`brand-surface` sidebar for skills and contact), and **ATS** (no columns, no
tints, no glyph bullets, parser-standard headings). Each states its trade-off at
the point of choice, because picking Designer for a machine-screened application
costs an interview and candidates never find out.

The sheet also carries `wrap-anywhere`, declared once on `SHEET_SURFACE` so every
template and the cover letter inherit it. Everything on a sheet is text the user
typed, and a single unbroken token — a tracking URL in the website field, a
German compound job title — used to print clipped off the paper edge. This is the
artifact the candidate emails to a recruiter; it does not get to overflow.
`anywhere` and not `break-word` because only `anywhere` counts toward min-content
sizing, which is what stops the Designer template's two-column grid being sized
by its longest word.

### Bounded input
Every free-text field has a cap, declared once per feature (`RESUME_LIMITS`,
`APPLICATION_LIMITS`, `COVER_LETTER_LIMITS`) and applied in two places: a zod
`.max()` and the matching `maxLength` on the control. The input stops accepting
text at the limit instead of letting someone write past it and meet an error
afterwards. Arrays are capped too — the "Add role" button disables itself and
says why, and the skills input does the same.

The caps are generous by design (a 2,000-character summary is already three times
too long), because they exist to stop the failure mode, not to police writing: the
CV editor autosaves the whole document to localStorage on every keystroke, so
unbounded text is a quota failure and an unbounded array is one DOM node per
entry.

**Loading must never be able to discard a document.** `resumeStorage.load()`
drops anything that fails `safeParse`, so length rules run *after*
`clampResume()` trims the stored value. A draft written before a cap existed is
still someone's real employment history; the worst case is a trimmed field they
can see, never a blank editor and no explanation.

### Signature — Living Backdrops
`AuroraBackdrop` (marketing/auth: CSS wash + drifting glows) and
`AmbientBackdrop` (app: restrained CSS glows). Both fixed, decorative,
theme-aware, and frozen under reduced motion — so no surface is ever flat. Pure
CSS, no WebGL. **Their alphas are a contrast ceiling, not a taste setting:**
`npm run check:contrast` measures the composited result and fails if they drift
up. At their original values the hero subhead measured 1.01:1.

### Touch targets
Anything under 24px in its visible box expands its hit area with an
absolutely-positioned `after:` pseudo-element (`after:-inset-x-2
after:-inset-y-2.5`) rather than gaining padding that would disturb layout. The
Switch and the coach's "Why I'm asking" disclosure both use this.

Standalone navigation links are not exempt. WCAG 2.2 SC 2.5.8's inline-text
exception covers a link inside a sentence, not a list of them — the marketing
footer's 18px-tall link rows were a real failure, and now carry `min-h-6` on the
link box itself.

### The assessment gate
**Nothing downstream of the assessment renders before the assessment exists**,
and the check lives in the service, not the call site. `documents-service`,
`resume-service` (via `useResume`) and `applications-service` each consult
`journeyStorage.hasAssessment()` and return empty; views then choose what to say
about it. Pre-assessment, they point at the coach rather than at an editor.

This is a design rule, not a data detail. The call-site version of it shipped
twice and was forgotten five times, and the failure mode is the worst thing this
product can do: an achievements screen congratulating a brand-new visitor for
"Completed your career assessment" is the exact inverse of *evidence over
assertion*. A gate that any new screen can forget to call is not a gate.

`journeyStorage` reads localStorage, so it answers "no" on the server. Anything
consulting it during render must go through `useHasAssessment()`
(`useSyncExternalStore`, `null` until known) or read it after mount — never
inline in a `useState` initialiser.

### Status pages
`/not-found` and `error.tsx` share `components/shared/status-page.tsx`: the
aurora backdrop, logo and theme toggle, one heading, one reassurance, one primary
action back into the product. They carry their own chrome because both fire
outside `(app)` — a stale bookmark, or a render error that took the sidebar with
it. Retired routes (`/roadmap`, `/achievements`) are live links in people's mail,
so this page is reached by users who did nothing wrong; the copy says so, and
says their work is safe. Before this existed a dead URL rendered the framework's
unstyled "404: This page could not be found."

## 6. Do's and Don'ts

### Do:
- **Do** carry the identity in teal + gold, with one Geist family across the UI.
- **Do** keep muted text at ≥4.5:1 — bump toward ink before dropping to gray.
- **Do** use gold only for completion (the Gold-Is-Earned Rule); amber only for
  warnings; and reserve a warm *fill* for earned states, outlining warm status
  chips (the Filled-Is-Earned Corollary).
- **Do** reach for `brand-surface` when a fold should BE the brand, and the shared
  document sheet for anything that gets printed.
- **Do** give every surface a living backdrop; never ship a flat block of colour.
- **Do** prove contrast on the rendered page (`npm run check:contrast`), not from
  token math — every composite failure this system has had was invisible to the
  token gate.
- **Do** give buttons real depth: inset-ring highlight + soft shadow + brightness
  hover; default height 36px.
- **Do** honor `prefers-reduced-motion` on every animation.
- **Do** treat the root providers as the most expensive real estate in the app.
  Whatever `app-providers.tsx` imports, every visitor downloads on every route,
  including the landing page — and a runtime `if` does not save them, because the
  branch is decided after the download. A provider that is usually inactive
  (Clerk) is lazy; a store that holds one component's boolean is not a provider
  at all.

### Don't:
- **Don't** use indigo/violet/fuchsia or a purple gradient — the generic AI-SaaS
  tell (the No-Purple Rule).
- **Don't** ship gradient-filled text (`background-clip: text`); emphasize with
  weight or a solid teal.
- **Don't** look like a **cold enterprise / HR portal** — stiff, gray, joyless.
- **Don't** look like an **over-gamified job app** — badge-spam, confetti,
  cartoon mascots, XP counters, badge walls. The achievements screen was
  removed for exactly this: with the roadmap gone nothing fed it, and it had
  become a hero-metric row above a twelve-tile identical grid. The coach avatar
  stays tasteful and adult.
- **Don't** look like a **crypto/neon-dark** hype page — glow-on-black distrust.
- **Don't** look like a **cheap resume-builder** — busy, ad-heavy, template-picker.
- **Don't** use decorative glassmorphism, side-stripe borders, nested cards, or a
  tiny uppercase tracked eyebrow above every section.
- **Don't** use bounce/elastic easing; ease out with exponential curves only.
