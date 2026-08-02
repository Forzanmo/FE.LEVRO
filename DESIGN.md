---
name: Levvro
description: AI Career Intelligence — see what your CV actually proves, and fix what it doesn’t.
colors:
  navy-surface: "#0b2540"
  navy-deep: "#091d33"
  navy-primary: "#0d4980"
  navy-mid: "#1a63ab"
  navy-pale: "#9cc4f2"
  teal-accent: "#21b7a5"
  teal-light: "#45c9b7"
  teal-deep: "#0b7165"
  surface-light: "#f9fbfe"
  surface-dark: "#0a131e"
  card-light: "#ffffff"
  card-dark: "#101b2a"
  sidebar-dark: "#0d1826"
  ink: "#1f2937"
  paper-ink: "#f9fafc"
  muted-ink: "#5b6b7e"
  border-light: "#e3e8ed"
  mist: "#f2f5f8"
  success: "#1c9e5a"
  warning: "#f59e0b"
  danger: "#f43f5e"
typography:
  display:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif"
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
    backgroundColor: "{colors.navy-primary}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "0 0.875rem"
    height: "2.25rem"
  button-primary-hover:
    backgroundColor: "{colors.navy-mid}"
    textColor: "#ffffff"
  button-gradient:
    backgroundColor: "{colors.navy-surface}"
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

**Creative North Star: "The Standards Document"**

Levvro should feel like being handed a well-made technical report on your own
career — precise, unhurried, and signed by someone who shows their working. Not a
brochure and not a dashboard: a document of record, produced by an instrument you
trust. The system runs on two colours doing two jobs: a **deep navy** for
authority and calm (the committed folds, every primary action), and a
**saturated teal** for momentum and recognition (the mark's rising triangle, the
focus ring, the colour of a thing proven). Canonical colour is OKLCH; the hex
above is the sRGB projection.

The identity comes from the LEVRRO brand system: navy `#0a2540`, teal `#14b8a6`,
white breathing room, mist separators, and Poppins setting the wordmark. The mark
is a rising arrowhead with an open book cut out of it — ascent plus learning —
and its geometry is the source of the page's texture, not an afterthought bolted
onto it.

The register is premium, calm, and confident — editorial craft over decoration,
in the Linear/Notion lineage. Identity lives in colour, type, geometry and
motion, never in gimmicks. It explicitly rejects the "generic AI-SaaS" tell
(indigo/violet/fuchsia gradients, glassy cards, gradient-filled text, blurred
blobs behind everything), the cold enterprise HR portal, the over-gamified job
app, and the busy cheap resume-builder. Restraint governs the product surface;
the marketing surface may commit harder to colour.

Every palette value passes a WCAG-AA contrast gate at build time, and the
rendered pages pass a second gate that measures real composited pixels — the
design is provably legible in both light and dark before it ships.

**Key Characteristics:**
- Two-colour identity: navy (authority/trust) + teal (momentum/earned).
- Dark = navy-ink near-black, not pure black; light = near-white with a navy
  whisper, never a warm cream.
- Poppins for display and headings (the wordmark's own face), Geist for body and
  UI. A geometric against a neo-grotesque — a real contrast axis, not two
  near-identical sans faces.
- No screen is ever flat, and the thing filling it is the brand's own geometry:
  a chevron field derived from the mark. Never a blurred blob.
- Depth from soft shadows + hairline rings, not heavy borders.

## 2. Colors

A restrained two-hue system: navy carries the brand and every interactive
surface, teal marks what is earned, and a navy-tinted slate set carries
everything else. Status colours are functional only.

### Primary
- **Deep Navy** (`oklch(0.400 0.110 252)` / `#0d4980`): the primary action,
  current selection, links, and brand text on light. The committed brand surface
  is one ramp step deeper (`brand-900` / `#0b2540` — the identity navy itself),
  and dark mode's primary is `brand-600`, a saturated mid blue that still reads
  as the brand rather than as slate.

  Navy does **not** hand over to teal in dark mode. `brand` climbs to the pale
  end of its own ramp (`brand-300`) instead, because a product whose brand colour
  swaps hue by theme has no answer to "which colour is Levvro".

### Secondary
- **Teal** (`oklch(0.702 0.120 182)` / `#21b7a5`): the accent, and the terminus
  of the brand gradient. The colour of completion — a sent document, a skill
  finally evidenced — and of the focus ring. Never a button fill. Exposed as the
  `achievement` / `achievement-foreground` / `achievement-muted` roles. Teal needs
  opposite ends of its ramp depending on the surface: the role resolves to
  `accent-700` on paper (the identity value measures 2.51:1 there), and
  `brand-surface-accent` (`accent-400`) is the separate role for teal ON the
  committed navy.

### Neutral
- **Ink** (`#1f2937`) / **Paper Ink** (`#f9fafc`): primary text on light / dark.
- **Muted Ink** (`#5b6b7e`): secondary text — must still clear 4.5:1, never a
  light gray "for elegance". This is also the floor for muted ink ON a document
  sheet; `neutral-500` is a decorative tone, not a text colour.
- **Surface** (`#f9fbfe` light / `#0a131e` dark): the page base — near-white with
  a navy whisper, or a deep navy-ink near-black. Cards step one level
  (`#ffffff` / `#101b2a`), and mist (`#f2f5f8`) separates bands.
- **Border** (`#e3e8ed` light; translucent white in dark): hairline dividers.

### Functional (status)
- **Success green** (`#1c9e5a`), **Warning amber** (`#f59e0b`), **Danger rose**
  (`#f43f5e`), each with a tinted `-muted` surface for badges and callouts.
- There is **no `info` hue.** The `info` role exists and resolves to the brand
  navy — see the No-Second-Blue Rule below.

### Named Rules
**The No-Purple Rule.** Indigo, violet, and fuchsia are forbidden — that gradient
is the generic-AI-SaaS tell and reads as "an AI made this". Navy and teal are the
identity. A navy brand sits close enough to indigo that this rule now also means:
do not let the navy ramp drift past hue 252 toward violet.

**The No-Second-Blue Rule.** With the brand itself navy, there is no room in the
palette for another blue. Everything between navy (hue 252) and teal (182) is a
shade of the two colours the brand already owns, and violet is banned outright.
So the `info` role resolves to the brand navy rather than to sky, and any screen
needing a fifth distinguishable status reaches for teal, not for a new hue.

This is not theoretical: the applications funnel had `screening` on `info` and
`interview` on `brand`, which were different colours under the old teal identity
and the *same* colour under this one — two adjacent chips in one pipeline saying
different things in one blue. `interview` moved to the accent.

**The Teal-Is-Earned Rule.** Teal means **done**, and nothing else: a sent
document, a skill your CV now evidences, a completed step. It is never a button
fill, a border, a to-do marker, or default UI chrome. Its rarity is what makes it
read as a win — which is only affordable because navy carries the chrome. Amber
(`warning`) means warning; green (`success`) means an operation completed.

This rule inherited its shape from the gold it replaced, and the substitution is
deliberate: the identity's own reference calls teal the colour of "recognition
and momentum", and under a navy brand the accent is no longer spent on buttons.

**The Filled-Is-Earned Corollary.** Separating meanings by hue alone does not
work, and telling people to try harder did not fix it: under the previous palette
`warning` resolved to amber-700 and `achievement` to gold-800, two dark warm
values a pixel apart, so a filled amber "Thin" chip and a filled gold "5-day
streak" chip on the same dashboard were the same object meaning opposite things.
That was recorded as fixed once and came back, which is the evidence that a hue
rule is not enforceable by eye.

So the distinction is **shape**: a **filled** pill means earned; a pill that is
**outlined** is a status or a warning. Skill strength is outlined across its whole
set (border + text keep the hue, the dot reinforces it), so the set reads as one
taxonomy; the "Sent" document badge stays filled, because it is the completion
this rule exists to protect. The rule is kept under navy/teal even though the two
hues are now far apart, because the next palette change will not ask permission.

**The Green-Is-Not-Teal Rule.** `success` is a true green at hue 148, not
emerald. Emerald sits at ~165 and the brand teal at 182 — seventeen degrees
apart, both mid-dark, and they appear on the same dashboard. Two colours that
close read as one colour, which is the Filled-Is-Earned collision in a different
pair of hues.

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

**Display / Heading Font:** Poppins (with `ui-sans-serif, system-ui, sans-serif`
fallback), self-hosted via `next/font/local` in three static weights — 500, 600,
700. ~24KB, latin subset.
**Body / Label / UI Font:** Geist (same fallback), self-hosted variable.
**Numeric / Mono Font:** Geist Mono (with `ui-monospace, monospace`), for
tabular figures and counts.

**Character:** A geometric against a neo-grotesque. Poppins has circular bowls, a
single-storey `a` and tall ascenders; Geist has a double-storey `a` and tighter
apertures. They are different enough to read as a deliberate pairing rather than
as two sans faces someone failed to notice were nearly identical — which is the
pairing failure worth avoiding.

Poppins is not an aesthetic preference. The LEVRRO wordmark is set in it, so
headings in any other face would leave the logotype speaking a different language
from the page around it.

### Hierarchy
- **Display** (600–700, fluid to `3.5rem`, line-height 1.08, tracking −0.02em):
  marketing hero headline only.
- **Headline** (600, `2.25rem`, 1.12, −0.016em): section headings; `text-wrap:
  balance`.
- **Title** (600, `1rem`, 1.35): card and panel titles (weight, not size, sets them apart from body).
- **Body** (400, `1rem`, 1.5): running copy; cap prose at 65–75ch.
- **Label** (500, `0.875rem`, 1.35): UI labels, buttons, table headers.
- **Mono** (500, `1rem`, tabular): metrics, counts and dates — **in the app only**.

  The marketing page used it too, for the three step numbers and one "7 / 11".
  Eight glyphs is not worth a 31KB face on the first page a stranger loads on a
  phone, and Geist Sans with `tabular-nums` sets the same digits to the same
  widths. Mono is also declared `preload: false`, because fonts declared in the
  root layout are preloaded on every route whether or not it uses them — the
  same rule this system already applies to root providers.

### Named Rules
**The Two-Family Rule.** Poppins heads, Geist speaks, Geist Mono counts. Three
slots, and that is the whole system — do not introduce a fourth family, and in
particular do not add a second grotesque beside Geist or a second geometric
beside Poppins. If a surface needs more voice, it needs a different weight or a
different size, not a new typeface.

**The Geometric-Tracking Rule.** Display tracking is looser under Poppins than it
was under Geist: −0.02em at the top of the scale rather than −0.032em, relaxing
to `normal` by 20px. A geometric's round bowls collide long before a
neo-grotesque's do, and tracking cut for the wrong face is how "designed" becomes
"cramped". Never tighten a heading past −0.02em.

**The Mobile Headline Floor.** Every `display-*` clamp has its minimum set so the
hero lands in two to four lines at 375px, not five or six. The clamp minimum is a
mobile decision, not a leftover of the desktop maximum divided by something.

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
  label + Lucide icon. Active item gets a navy left indicator, a filled icon, and
  a muted surface. **Bottom nav (mobile)** mirrors the primary destinations.
- **Header and bottom nav:** sticky and **fully opaque**. No `/92`, no `/85`, no
  `backdrop-blur`.

  **The Opaque-Chrome Rule.** A translucent sticky bar composites over whatever
  happens to be scrolling beneath it, so its effective background is arbitrary
  and its contrast is not a fact anyone can check. This has now failed three
  times at three different alphas: `/50` on the marketing header (a near-black
  label on the dark CTA band, ~1.3:1), `/70` on the bottom nav (active label
  4.28:1), and `/88` on both (the bottom-nav labels at 4.12:1 and the wordmark at
  4.45:1 over `/documents/*` on mobile). Each fix lowered the alpha and each
  lower alpha failed somewhere else, because there is no value that is safe
  against an arbitrary backdrop. Opaque is the only version whose contrast is
  provable, and the blur goes with it — there is nothing left to blur.

  The **marketing header** follows the same rule on its own surface: it is the
  committed navy, opaque, so it reads as part of the drenched fold rather than as
  a light bar seaming across it.

  **The z-scale is the only source of stacking order.** Every overlay now names
  a token — `--z-dropdown` for menus and selects, `--z-overlay`/`--z-modal` for
  the sheet and dialog, `--z-popover`, `--z-tooltip`. The shadcn primitives all
  shipped with a hardcoded `z-50`, which is below `--z-sticky` (1100): nothing
  was visibly occluded, because menus open below the bar they would have
  collided with, but the first overlay that opened upward into sticky chrome
  would have vanished behind it.

  **The scale is ordered by dependency, not by name.** Two rules fix the order,
  and neither is a matter of taste:

  1. A transient overlay must escape whatever it was opened from — a menu that
     cannot get out from under a sticky header disappears at the wrong viewport.
  2. A transient overlay must also escape a **modal**, because it can be opened
     from inside one.

  So: `sticky (1000) → banner (1100) → overlay (1200) → modal (1300) →
  dropdown (1400) → popover (1500) → toast (1600) → tooltip (1700)`.

  `dropdown` used to be 1000, below both. Nothing exercised it while the shadcn
  primitives hardcoded `z-50` and DOM order quietly decided; the moment they
  moved onto these tokens, the status `Select` inside "Add application" started
  rendering its listbox *behind the dialog's own scrim*. `e2e/stacking.spec.ts`
  hit-tests the centre pixel of an open overlay and asserts the ordering
  directly, because neither axe nor a contrast gate can see this: the element is
  present, sized and correctly coloured. It is just behind something.
- **Every page needs a skip link**, not just the authenticated shell.
  `components/shared/skip-link.tsx` is the one implementation, paired with
  `id="main-content"` on the page's `<main>`. It used to live inline in
  `AppShell`, so the landing page made a keyboard user tab through six header
  stops before the first word of content (WCAG 2.4.1, Level A).
- **Marketing, small screens:** the header keeps exactly one action visible
  ("Get started") at every width and moves the rest into a sheet. Two text links
  plus two buttons plus a theme toggle do not fit at 320px, and the alternative
  to a menu is a row of cramped sub-44px targets. Radix's sheet brings the focus
  trap, escape-to-close, scroll lock and dialog semantics with it, so the mobile
  menu ends up more accessible than the desktop row it replaces.

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

### The mark, the icons, and the social card
Every rendering of the identity comes from one traced path. `BrandMark` draws it
in-app; `app/icon.svg` is the favicon and the source for `app/favicon.ico`
(16/32/48/256, PNG payloads in an ICO container) and `app/apple-icon.png`;
`app/opengraph-image.png` and `app/twitter-image.png` are the social card.

Regenerate them all with `node scripts/build-brand-assets.mjs` after any change
to the mark or the palette — they are rendered artefacts, not hand-drawn, and
the point of one command is that they cannot drift apart.

Two failures this guards against, both of which happened:

- **A stale `favicon.ico` outlived a whole redesign.** It sat in `src/app/`, so
  a check of `public/` said the project had none, and nothing imports it and no
  gate visits it. Next lists it *first* in the document head, so browsers and
  crawlers kept getting the previous mark — a black circle — while every surface
  a human looked at was correct.
- **`twitter:card` declared `summary_large_image` with no image.** The card
  existed in metadata and the image never did (`siteConfig.ogImage` pointed at a
  `/og.png` that was never created, and nothing referenced it anyway), so every
  share rendered blank. The social card is a brand surface; it just is not one
  anybody on the team looks at.

The social card embeds Poppins and Geist as base64 rather than relying on
`next/font`, because it renders in an isolated page where the font pipeline does
not apply — otherwise the most-shared asset in the product ships in whatever
sans the renderer happens to have.

### The mark and the wordmark
The mark is a rising arrowhead with an open book cut out of it and a teal
triangle at the apex — ascent plus learning. It ships as `BrandMark`, a traced
vector (`components/layout/brand-mark.tsx`), not the source raster: it has to
render at 24px in a sidebar, 32px in a header and 512px in an app-icon slot, and
to invert to white on the committed navy. The body is `currentColor` so a parent
can set it with a text utility; only the apex triangle carries its own fill,
because it is the one part that stays teal on every surface.

The geometry is traced from the supplied 1024px artwork and **re-coloured to the
canonical tokens** — the artwork's own values (`#06274c` / `#19b5a8`) are near
misses of the brand navy and teal, and shipping both would give the product two
slightly different blues that nobody could name.

The wordmark sets its final letter in the accent (`Levvr` + a teal `o`), carried
over from the identity's own `LEVRR` + teal `O`. It ties the lockup to the mark's
apex triangle and gives the accent one guaranteed appearance on every screen —
scarcity works better when the one place it always shows is the brand's name.
That letter is also the most contrast-fragile text in the product: it is the
reason `accent-700` sits at L 0.495 rather than 0.516.

### Signature — The assessment panel
The marketing hero's product shot (`components/marketing/assessment-panel.tsx`)
is the skills assessment mid-run: a coverage count, a segmented meter, three
verdicts, the CV line that earned one of them, and a fourth row resolving from
"Reading your experience…" into its verdict.

It answers all three hero questions without being read — what this is, who it is
for, why it is different — which a generic dashboard screenshot does not. Two
rules govern what may appear in it:

- **Nothing it claims may be something the product cannot do.** The verdicts are
  the three the dashboard actually issues, the reasoning line is the shape of
  evidence the coach collects, and the counts reconcile with the meter. A "94%
  match score" would be exactly the assertion-over-evidence the product exists to
  argue against, on the first screen a stranger sees.
- **The resolved state is the CSS default.** The one-shot animation replays how
  the verdict was reached; it never gates whether the verdict is visible. No
  `animation-fill-mode`, no class-triggered reveal. If the animation never ticks —
  background tab, headless renderer, a browser that skipped it — the panel is
  simply already finished.

A segmented meter, not a smooth bar: the quantity is a count of discrete skills,
and a continuous bar would imply a precision the assessment does not claim.

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

### Signature — The chevron field
The mark's arrowhead, tiled as a fine hatch (`chevron-field`, a 28×14 mask so one
utility serves navy-on-paper and white-on-navy by inheriting `color`). It is the
texture layer on every surface: `BrandBackdrop` (marketing/auth/status) and
`AmbientBackdrop` (the app) both draw it over two soft atmospheric pools, so no
surface is ever flat. Pure CSS, server-rendered, no WebGL, no images.

This replaced three blurred drifting blobs. Blurred blobs are the most saturated
backdrop cliché on the web and they carried nothing: swap the hue and the page
belongs to any other product. A shape taken from the logo cannot be copied
without copying the logo.

**It rises, and only on the marketing surface.** One ambient motion, moving in
one direction, meaning the one thing the brand personality claims (upward). The
app's copy of the field never moves — someone editing their CV is not being told
a story, and ambient motion under working content is distraction dressed as
craft. Below 768px the drift is off entirely: a full-viewport animation is not
what a phone should spend its battery on.

**Tile size is the difference between texture and wallpaper.** At 48×24 with a
1.25px stroke the chevrons read AS chevrons across a whole section — patterned,
not premium. Half that, with a 0.9px stroke, reads as engraving.

**The alphas are a contrast ceiling, not a taste setting:**
`npm run check:contrast` measures the composited result on the real pages and
fails if they drift up. Under the previous backdrop the hero subhead measured
1.01:1, and the densest part of the navy pool — which sits directly under the
header, where the logo is — put the wordmark's teal `o` three hundredths under AA.
Neither was visible to the token gate.

### Touch targets
Anything under 24px in its visible box expands its hit area with an
absolutely-positioned `after:` pseudo-element (`after:-inset-x-2
after:-inset-y-2.5`) rather than gaining padding that would disturb layout. The
Switch and the coach's "Why I'm asking" disclosure both use this.

Standalone navigation links are not exempt. WCAG 2.2 SC 2.5.8's inline-text
exception covers a link inside a sentence, not a list of them — the marketing
footer's 18px-tall link rows were a real failure, and now carry `min-h-6` on the
link box itself.

### A first visit is signed out
The app used to seed an authenticated, onboarded user on first paint so it was
reviewable without a login wall. The cost of that convenience was the entire top
of the funnel: `/sign-in` and `/onboarding` both redirected to `/dashboard`,
every marketing CTA landed on a populated dashboard, and no visitor could create
an account — the product shipped with no way to acquire a user. It also greeted
strangers by the name of someone who is not them.

Browsing without signing in still exists, behind `NEXT_PUBLIC_DEMO_MODE=1`. A
review convenience must never be the thing a real visitor gets.

This is load-bearing for the verification gates too: they need an explicit
`no-assessment` state (signed in, onboarded, assessment never taken) to reach
the pre-assessment designs. Without it those four routes redirect to sign-in and
both gates report green while measuring the sign-in page over and over.

### Disabled is a muted surface, not a faded copy
`disabled:opacity-50` on a filled button is white text over 50% brand teal:
measured 2.25:1. Disabled controls are exempt from WCAG 1.4.3, so this passes
every automated gate including this project's own — and it was the coach's
primary "Continue", on the screen where an anxious first-timer is least sure
they are doing it right, unable to read the word blocking them.

Disabled now resolves to `bg-muted` + `text-muted-foreground` (7.03:1) uniformly
across every variant, so disabled looks the same everywhere. And a disabled
control must be paired with text saying what is required — "Pick one to
continue" — because the disabled state communicates "not yet" but never "why
not".

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

`cover-letter-service` was the fifth service and the one that forgot: without an
assessment it still produced a complete, confident, downloadable letter signed
with the user's name — the one artifact a candidate emails to a recruiter,
invented. `generate()` now fails closed, so a call site that forgets gets
nothing rather than a fabrication.

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
- **Do** carry the identity in navy + teal, with Poppins heading and Geist speaking.
- **Do** keep muted text at ≥4.5:1 — bump toward ink before dropping to gray.
- **Do** use teal only for completion (the Teal-Is-Earned Rule); amber only for
  warnings; green only for operations that succeeded; and reserve a *fill* for
  earned states, outlining status chips (the Filled-Is-Earned Corollary).
- **Do** reach for `brand-surface` when a fold should BE the brand, and the shared
  document sheet for anything that gets printed.
- **Do** give every surface the chevron field; never ship a flat block of colour,
  and never reach for a blurred blob to avoid one.
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
  tell (the No-Purple Rule) — and don't introduce a second blue beside the brand
  navy (the No-Second-Blue Rule).
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
