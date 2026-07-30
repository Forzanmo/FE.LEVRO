/**
 * Token generator — projects lib/design/tokens.ts into CSS.
 *
 * Emits two committed, never-hand-edited files:
 *   src/styles/tokens.generated.css  — the :root / .dark custom-property layer
 *   src/styles/theme.generated.css   — the Tailwind v4 `@theme inline` mapping
 *
 * Colors are emitted in OKLCH (perceptually uniform, P3-ready). Before writing,
 * a WCAG-AA contrast gate checks the key text/surface pairs in BOTH themes
 * (compositing translucent surfaces over the page background) and FAILS the
 * build on any violation — the palette is provably accessible or it doesn't ship.
 *
 * Run with: `npm run tokens` (also runs on predev / prebuild). Node native TS.
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { converter, wcagContrast, type Rgb } from 'culori'

import {
  palette,
  semanticColors,
  radiusBase,
  radius,
  shadow,
  motion,
  zIndex,
  layout,
  type SemanticColorRole,
} from '../src/lib/design/tokens.ts'

const toOklch = converter('oklch')
const toRgb = converter('rgb')

const round = (n: number, d: number) => Number(n.toFixed(d))

/* ------------------------------- OKLCH output ------------------------------ */

function oklchStr(value: string): string {
  const c = toOklch(value)
  if (!c) return value
  const l = round(c.l, 4)
  const chroma = round(c.c, 4)
  const h = c.h == null || Number.isNaN(c.h) ? 0 : round(c.h, 2)
  const a = c.alpha ?? 1
  return a < 1 ? `oklch(${l} ${chroma} ${h} / ${round(a, 3)})` : `oklch(${l} ${chroma} ${h})`
}

/* ------------------------------ Contrast gate ------------------------------ */

const WHITE: Rgb = { mode: 'rgb', r: 1, g: 1, b: 1 }

function compositeOver(value: string, over: Rgb): Rgb {
  const c = toRgb(value)
  if (!c) return over
  const a = c.alpha ?? 1
  if (a >= 1) return { mode: 'rgb', r: c.r, g: c.g, b: c.b }
  return {
    mode: 'rgb',
    r: a * c.r + (1 - a) * over.r,
    g: a * c.g + (1 - a) * over.g,
    b: a * c.b + (1 - a) * over.b,
  }
}

function contrastRatio(fg: string, bg: string, pageBg: string): number {
  const base = compositeOver(pageBg, WHITE)
  const bgRgb = compositeOver(bg, base)
  const fgRgb = compositeOver(fg, bgRgb)
  return wcagContrast(fgRgb, bgRgb)
}

/**
 * [foreground role, background role, minimum ratio, surface the bg composites over].
 *
 * The fourth element matters for the `*-muted` tints, which are translucent.
 * They were only ever checked over `background`, but badges live on CARDS — and
 * a card is a lighter surface, so the same tint resolves differently underneath
 * them. `destructive` on `destructive-muted` passed the gate at page level and
 * still measured 4.10:1 on a real card in dark mode. Defaults to 'background'.
 */
const CONTRAST_PAIRS: [SemanticColorRole, SemanticColorRole, number, SemanticColorRole?][] = [
  ['foreground', 'background', 4.5],
  ['foreground', 'card', 4.5],
  ['foreground', 'muted', 4.5],
  ['muted-foreground', 'background', 4.5],
  ['muted-foreground', 'card', 4.5],
  ['muted-foreground', 'muted', 4.5],
  ['card-foreground', 'card', 4.5],
  ['popover-foreground', 'popover', 4.5],
  ['secondary-foreground', 'secondary', 4.5],
  ['accent-foreground', 'accent', 4.5],
  ['sidebar-foreground', 'sidebar', 4.5],
  ['sidebar-accent-foreground', 'sidebar-accent', 4.5],
  ['primary-foreground', 'primary', 4.5],
  ['brand', 'background', 4.5],
  ['brand', 'card', 4.5],
  ['brand', 'brand-muted', 4.5],
  ['success', 'success-muted', 4.5],
  ['warning', 'warning-muted', 4.5],
  ['info', 'info-muted', 4.5],
  ['destructive', 'destructive-muted', 4.5],

  // Non-text contrast, WCAG 2.2 SC 1.4.11 (3:1). The focus ring is the single
  // affordance a keyboard user navigates the entire product by, so it is tested
  // against every surface it can land on — page, card, and muted (ghost buttons).
  ['ring', 'background', 3],
  ['ring', 'card', 3],
  ['ring', 'muted', 3],
  ['sidebar-ring', 'sidebar', 3],

  // Text on solid fills that the previous pair list never covered.
  ['destructive-foreground', 'destructive', 4.5],
  ['brand-foreground', 'brand', 4.5],
  ['sidebar-primary-foreground', 'sidebar-primary', 4.5],
  ['success-foreground', 'success', 4.5],
  ['warning-foreground', 'warning', 4.5],
  ['info-foreground', 'info', 4.5],
  ['achievement', 'achievement-muted', 4.5],
  ['achievement-foreground', 'achievement', 4.5],
  ['achievement', 'card', 4.5],

  // The same tinted badges, composited over a card rather than the page.
  ['success', 'success-muted', 4.5, 'card'],
  ['warning', 'warning-muted', 4.5, 'card'],
  ['info', 'info-muted', 4.5, 'card'],
  ['destructive', 'destructive-muted', 4.5, 'card'],
  ['brand', 'brand-muted', 4.5, 'card'],
  ['achievement', 'achievement-muted', 4.5, 'card'],

  // The committed brand surface. Its foreground is fixed at white and the
  // surface never changes with the theme, so both pairs are checkable up front —
  // which is the point of promoting it from three hardcoded call sites to a role.
  ['brand-surface-foreground', 'brand-surface', 4.5],
  ['brand-surface-muted', 'brand-surface', 4.5],
  ['brand-surface-accent', 'brand-surface', 4.5],
]

function auditContrast(): string[] {
  const failures: string[] = []
  for (const mode of ['light', 'dark'] as const) {
    const colors = semanticColors[mode]
    for (const [fg, bg, min, over = 'background'] of CONTRAST_PAIRS) {
      const ratio = contrastRatio(colors[fg], colors[bg], colors[over])
      if (ratio + 0.005 < min) {
        const where = over === 'background' ? '' : ` (on ${over})`
        failures.push(
          `  ✗ [${mode}] ${fg} on ${bg}${where} — ${round(ratio, 2)}:1 (needs ${min}:1)`,
        )
      }
    }
  }
  return failures
}

/* --------------------------- tokens.generated.css -------------------------- */

const INDENT = '  '
const block = (lines: string[]): string => lines.map((l) => INDENT + l).join('\n')

const OUT_DIR = join(import.meta.dirname, '..', 'src', 'styles')

const paletteVars = (): string[] =>
  Object.entries(palette).flatMap(([group, shades]) =>
    Object.entries(shades).map(([shade, value]) => `--${group}-${shade}: ${oklchStr(value)};`),
  )

const roleVars = (map: Record<string, string>): string[] =>
  Object.entries(map).map(([role, value]) => `--${role}: ${oklchStr(value)};`)

const shadowVars = (map: Record<string, string>): string[] =>
  Object.entries(map).map(([key, value]) => `--shadow-${key}: ${value};`)

const scaleVars = (): string[] => [
  `--radius: ${radiusBase};`,
  `--radius-full: ${radius.full};`,
  ...Object.entries(motion.duration).map(([k, v]) => `--duration-${k}: ${v};`),
  ...Object.entries(motion.easing).map(([k, v]) => `--ease-${k}: ${v};`),
  ...Object.entries(zIndex).map(([k, v]) => `--z-${k}: ${v};`),
  ...Object.entries(layout).map(([k, v]) => `--${k}: ${v};`),
]

const tokensCss = `/**
 * AUTO-GENERATED by scripts/build-tokens.mts — DO NOT EDIT.
 * Edit lib/design/tokens.ts then run \`npm run tokens\`. Colors are OKLCH and
 * pass a WCAG-AA contrast gate (enforced at build time).
 */

:root {
  /* Palette ramps */
${block(paletteVars())}

  /* Semantic roles — light */
${block(roleVars(semanticColors.light))}

  /* Scales */
${block(scaleVars())}

  /* Elevation — light */
${block(shadowVars(shadow.light))}
}

.dark {
  /* Semantic roles — dark */
${block(roleVars(semanticColors.dark))}

  /* Elevation — dark */
${block(shadowVars(shadow.dark))}
}
`

/* ---------------------------- theme.generated.css -------------------------- */

const semanticThemeVars = (): string[] =>
  Object.keys(semanticColors.light).map((role) => `--color-${role}: var(--${role});`)

const paletteThemeVars = (): string[] =>
  Object.entries(palette).flatMap(([group, shades]) =>
    Object.keys(shades).map((shade) => `--color-${group}-${shade}: var(--${group}-${shade});`),
  )

const shadowThemeVars = (): string[] =>
  Object.keys(shadow.light).map((k) => `--shadow-${k}: var(--shadow-${k});`)

const easeThemeVars = (): string[] =>
  Object.keys(motion.easing).map((k) => `--ease-${k}: var(--ease-${k});`)

const themeCss = `/**
 * AUTO-GENERATED by scripts/build-tokens.mts — DO NOT EDIT.
 * Tailwind v4 theme mapping: every design token exposed as a utility.
 */

@theme inline {
  /* Typography */
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-heading: var(--font-heading);

  /* Radius scale — derived from the base --radius */
  --radius-xs: calc(var(--radius) * 0.5);
  --radius-sm: calc(var(--radius) * 0.7);
  --radius-md: calc(var(--radius) * 0.85);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.35);
  --radius-2xl: calc(var(--radius) * 1.85);
  --radius-3xl: calc(var(--radius) * 2.4);

  /* Semantic colors */
${block(semanticThemeVars())}

  /* Palette ramps */
${block(paletteThemeVars())}

  /* Elevation */
${block(shadowThemeVars())}

  /* Easing */
${block(easeThemeVars())}
}
`

/* -------------------------------- write ------------------------------------ */

const failures = auditContrast()
if (failures.length > 0) {
  console.error(`\n✗ Contrast gate failed (${failures.length} pair(s) below WCAG AA):`)
  console.error(failures.join('\n'))
  console.error('\nFix the values in src/lib/design/tokens.ts and re-run.\n')
  process.exit(1)
}

/**
 * Never emit a value the browser will silently discard.
 *
 * `alpha()` used to hex-parse an OKLCH input and produce
 * `rgb(NaN NaN NaN / 0.15)`. Invalid custom properties do not throw — they just
 * fail to apply — so `--brand-muted` was blank across 15 dark-mode surfaces and
 * nothing caught it until the UI was rendered and sampled. A generated
 * stylesheet should be provably well-formed before it ships.
 */
for (const [name, css] of [
  ['tokens.generated.css', tokensCss],
  ['theme.generated.css', themeCss],
] as const) {
  const bad = css
    .split('\n')
    .map((line, i) => [i + 1, line] as const)
    .filter(([, line]) => /NaN|undefined|null/.test(line))
  if (bad.length) {
    console.error(`\n✗ ${name} contains invalid values:`)
    for (const [n, line] of bad) console.error(`  ${n}: ${line.trim()}`)
    console.error('\nThese would be silently dropped by the browser. Fix tokens.ts and re-run.')
    process.exit(1)
  }
}

writeFileSync(join(OUT_DIR, 'tokens.generated.css'), tokensCss, 'utf8')
writeFileSync(join(OUT_DIR, 'theme.generated.css'), themeCss, 'utf8')
console.log(
  `✓ tokens written in OKLCH; contrast gate passed (${CONTRAST_PAIRS.length} pairs × 2 themes)`,
)
