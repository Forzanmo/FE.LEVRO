/**
 * Levrro Design Tokens — single source of truth.
 *
 * Every color, radius, shadow, motion value, z-index and layout dimension in
 * the product originates here. Nothing downstream (Tailwind, Mantine, Theme UI,
 * component styles) is allowed to hardcode a raw value — it must reference a
 * token exported from this file, or a CSS variable generated from it.
 *
 * Projection pipeline (single styling system — Tailwind v4 + shadcn/Radix):
 *   tokens.ts ──▶ scripts/build-tokens.mts ──┬▶ styles/tokens.generated.css  (:root/.dark vars)
 *                                            └▶ styles/theme.generated.css   (Tailwind @theme)
 *
 * To change a value: edit it here, then run `npm run tokens`.
 */

/* -------------------------------------------------------------------------- */
/* Primitives — raw color ramps. The ONLY place literal colors are declared.  */
/* -------------------------------------------------------------------------- */

export const palette = {
  /**
   * Primary brand — DEEP NAVY. The authority half of the LEVRRO identity: the
   * colour of the mark's arrowhead, the committed hero surface, and every
   * primary action. `brand-900` is the identity value itself (#0a2540) and is
   * what `brand-surface` resolves to, so the drenched folds are literally the
   * brand navy rather than an approximation of it.
   *
   * Chroma peaks mid-ramp on purpose. A navy that desaturates as it lightens
   * turns grey-blue, and the dark theme's primary lives at 600 — it has to read
   * as the brand blue there, not as slate.
   *
   * Authored in OKLCH so lightness is intentional and the WCAG gate stays
   * predictable.
   */
  brand: {
    50: 'oklch(0.972 0.012 252)',
    100: 'oklch(0.938 0.026 252)',
    200: 'oklch(0.884 0.048 252)',
    300: 'oklch(0.806 0.078 252)',
    400: 'oklch(0.700 0.114 252)',
    500: 'oklch(0.585 0.142 252)',
    600: 'oklch(0.487 0.130 252)',
    700: 'oklch(0.400 0.110 252)',
    800: 'oklch(0.327 0.086 252)',
    /** #0a2540 — THE brand navy. `brand-surface` is this value. */
    900: 'oklch(0.260 0.060 252)',
    950: 'oklch(0.212 0.048 252)',
  },
  /**
   * Accent — TEAL. The momentum half of the identity: the mark's rising
   * triangle, the focus ring, the "proven" verdict, and the colour of a thing
   * completed. `accent-500` is the identity teal (#14b8a6 family).
   *
   * Teal is scarce by design. Navy carries the chrome; teal is the one place
   * the eye is told to go.
   */
  accent: {
    50: 'oklch(0.977 0.017 182)',
    100: 'oklch(0.947 0.040 182)',
    200: 'oklch(0.898 0.073 182)',
    300: 'oklch(0.836 0.102 182)',
    400: 'oklch(0.760 0.117 182)',
    /** #21b7a5 — THE brand teal. */
    500: 'oklch(0.702 0.120 182)',
    600: 'oklch(0.611 0.104 182)',
    /*
     * 0.495, not 0.516. This is the light-mode `achievement` and `ring` value,
     * so it lands on every surface the page has — including the densest part of
     * the backdrop's navy pool, which sits directly under the header where the
     * wordmark's teal `o` is. There it measured 4.47:1: three hundredths under
     * AA, on fifteen text runs across seven routes.
     *
     * The token gate could not see this. It compares role against role, and
     * `achievement` on `card` was a comfortable 5.35:1; what the letter actually
     * sits on is a composite of a decorative gradient over the page, which no
     * pair of tokens describes. Only the rendered gate catches it, and the fix
     * belongs here rather than in the backdrop's alpha — the accent has to be
     * legible wherever it is used, not only where the tint happens to be thin.
     */
    700: 'oklch(0.495 0.086 182)',
    800: 'oklch(0.436 0.071 182)',
    900: 'oklch(0.376 0.058 182)',
    950: 'oklch(0.284 0.043 182)',
  },
  /**
   * Success — true GREEN, not emerald.
   *
   * Emerald sits at hue ~165 and the brand teal at 182: seventeen degrees
   * apart, both mid-dark, and they appear on the same dashboard (a green "Well
   * evidenced" chip beside a teal "Sent" badge). Two colours that close reading
   * as one colour is the same failure the old gold/amber collision was, and
   * that one came back twice because it was left to the eye. Green at hue 148
   * is a different colour at a glance.
   */
  success: {
    50: 'oklch(0.972 0.025 148)',
    100: 'oklch(0.944 0.052 148)',
    200: 'oklch(0.895 0.093 148)',
    300: 'oklch(0.833 0.135 148)',
    400: 'oklch(0.755 0.168 147)',
    500: 'oklch(0.680 0.170 147)',
    600: 'oklch(0.588 0.150 148)',
    700: 'oklch(0.490 0.124 149)',
    800: 'oklch(0.415 0.101 150)',
    900: 'oklch(0.356 0.083 151)',
    950: 'oklch(0.256 0.060 152)',
  },
  /** Warning — amber. */
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  /** Danger / destructive — rose. */
  danger: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
    950: '#4c0519',
  },
  /*
   * There is no `info` ramp, and that is deliberate.
   *
   * `info` used to be sky blue. With the brand itself now navy, a second blue
   * has nowhere to live: violet is banned outright (the generic-AI-SaaS tell),
   * and everything between navy (hue 252) and teal (182) is another shade of
   * the two colours the brand already owns. Sky-700 beside navy-700 was two
   * dark blues meaning different things — the applications pipeline put them in
   * adjacent chips.
   *
   * So the `info` ROLE survives and resolves to the brand navy. Informational
   * is brand-toned; there is no fifth hue to remember. The pipeline separates
   * its stages by giving `interview` the teal instead — see
   * `features/applications/status.ts`.
   */
  /**
   * Neutral — cool SLATE, tinted toward the brand navy rather than pure grey.
   *
   * Anchored on the identity's own neutrals: 100 is the kit's mist (#f2f5f9),
   * 200 its hairline (#e3e9f0), 600 its slate body copy (#5b6b7e) and 900 its
   * ink (#1f2937). Zinc was hue-neutral and left every surface reading slightly
   * warm against a navy brand.
   */
  neutral: {
    50: 'oklch(0.985 0.003 252)',
    100: 'oklch(0.968 0.006 252)',
    200: 'oklch(0.931 0.011 252)',
    300: 'oklch(0.876 0.014 252)',
    400: 'oklch(0.722 0.024 252)',
    500: 'oklch(0.610 0.030 252)',
    600: 'oklch(0.522 0.036 253)',
    700: 'oklch(0.412 0.033 254)',
    800: 'oklch(0.330 0.031 256)',
    900: 'oklch(0.278 0.030 257)',
    950: 'oklch(0.205 0.026 255)',
  },
} as const

const pureWhite = '#ffffff'

export type PaletteGroup = keyof typeof palette
export type PaletteShade = keyof (typeof palette)['brand']

/* -------------------------------------------------------------------------- */
/* Semantic color roles — light & dark. Values reference primitives only.     */
/* Names mirror the shadcn/ui contract, extended with brand/status/gradient.  */
/* -------------------------------------------------------------------------- */

export type SemanticColorRole =
  | 'background'
  | 'foreground'
  | 'card'
  | 'card-foreground'
  | 'popover'
  | 'popover-foreground'
  | 'primary'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-foreground'
  | 'muted'
  | 'muted-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'destructive'
  | 'destructive-foreground'
  | 'destructive-muted'
  | 'border'
  | 'input'
  | 'ring'
  | 'chart-1'
  | 'chart-2'
  | 'chart-3'
  | 'chart-4'
  | 'chart-5'
  | 'sidebar'
  | 'sidebar-foreground'
  | 'sidebar-primary'
  | 'sidebar-primary-foreground'
  | 'sidebar-accent'
  | 'sidebar-accent-foreground'
  | 'sidebar-border'
  | 'sidebar-ring'
  | 'brand'
  | 'brand-foreground'
  | 'brand-muted'
  | 'brand-emphasis'
  | 'success'
  | 'success-foreground'
  | 'success-muted'
  | 'warning'
  | 'warning-foreground'
  | 'warning-muted'
  | 'info'
  | 'info-foreground'
  | 'info-muted'
  /**
   * Achievement TEAL. The ONLY colour of a win: completed milestones, a sent
   * document, a skill that is finally evidenced.
   *
   * The role predates the navy identity, when the win colour was gold. It
   * survives the palette change because the failure it guards against does: a
   * product that has no dedicated "earned" colour borrows `warning` for it, and
   * then one amber pill means "5-day streak, well done" while an identical
   * amber pill 600px away means "your score dropped". Achievement and warning
   * are different things and each says exactly one thing.
   *
   * Under the navy identity teal is free to take this job — navy carries the
   * chrome, so the accent is not already spent on buttons.
   */
  | 'achievement'
  | 'achievement-foreground'
  | 'achievement-muted'
  /**
   * The committed brand surface — a fold that IS the brand rather than being
   * tinted by it: the marketing hero, its header, the CTA band, the Designer CV
   * sidebar.
   *
   * These are deliberately IDENTICAL in light and dark. A hero that inverts with
   * the theme cannot commit to a colour, and the whole point of a committed
   * surface is that the colour carries the identity. That property is also what
   * makes the foreground safe to fix at white.
   *
   * The role exists because three surfaces had each hardcoded their own version —
   * `bg-[var(--brand-950)]`, the `bg-gradient-brand-deep` utility, and
   * `bg-[var(--brand-900)]` — so "the brand surface" had three different colours
   * and no single place to change it.
   */
  | 'brand-surface'
  | 'brand-surface-foreground'
  /** Secondary copy on the committed surface — still AA against it. */
  | 'brand-surface-muted'
  /**
   * Teal ON the committed surface. A separate role from `achievement` because
   * that one is tuned for paper (a dark accent-700) and would sink into the
   * navy — the same hue needs the opposite end of the ramp to be legible on a
   * near-black navy. Two contexts, two values, one meaning.
   */
  | 'brand-surface-accent'
  | 'gradient-from'
  | 'gradient-via'
  | 'gradient-to'
  | 'progress-track'

type SemanticColorMap = Record<SemanticColorRole, string>

/**
 * Fade a colour toward transparent, in whatever colour space it is authored in.
 *
 * This used to hex-parse. The brand ramp is authored in OKLCH while
 * success/warning/info are hex, so `alpha(palette.brand[500], 0.15)` produced
 * `rgb(NaN NaN NaN / 0.15)` — an invalid declaration browsers silently drop,
 * which blanked every `bg-brand-muted` surface in dark mode (the coach avatar,
 * empty-state icons, the header avatar, status badges). `color-mix` is
 * colour-space agnostic, so the input notation no longer matters.
 */
const alpha = (color: string, a: number): string =>
  `color-mix(in oklab, ${color} ${a * 100}%, transparent)`

export const semanticColors: { light: SemanticColorMap; dark: SemanticColorMap } = {
  light: {
    // Near-white with a whisper of the brand navy (cool, never warm) so white
    // cards lift off it. The identity's own paper is pure white; the page sits
    // one hair below it so elevation still reads.
    background: 'oklch(0.988 0.004 252)',
    foreground: palette.neutral[900],
    card: pureWhite,
    'card-foreground': palette.neutral[900],
    popover: pureWhite,
    'popover-foreground': palette.neutral[900],
    primary: palette.brand[700],
    'primary-foreground': pureWhite,
    secondary: palette.neutral[100],
    'secondary-foreground': palette.neutral[900],
    muted: palette.neutral[100],
    'muted-foreground': palette.neutral[600],
    accent: palette.neutral[100],
    'accent-foreground': palette.neutral[900],
    destructive: palette.danger[700],
    'destructive-foreground': pureWhite,
    'destructive-muted': palette.danger[50],
    border: palette.neutral[200],
    input: palette.neutral[200],
    // The focus ring is TEAL, not navy — the identity's own focus colour, and
    // the one place the accent is guaranteed to appear on every screen. The
    // identity teal (accent-500) measures 2.51:1 on paper, under SC 1.4.11, so
    // the ring steps down the ramp until it clears 3:1 on page, card and muted
    // alike. Teal at 700 is still unmistakably teal beside a navy control.
    ring: palette.accent[700],
    'chart-1': palette.brand[600],
    'chart-2': palette.accent[500],
    'chart-3': palette.success[600],
    'chart-4': palette.warning[500],
    'chart-5': palette.danger[500],
    sidebar: palette.neutral[50],
    'sidebar-foreground': palette.neutral[900],
    'sidebar-primary': palette.brand[700],
    'sidebar-primary-foreground': pureWhite,
    'sidebar-accent': palette.neutral[100],
    'sidebar-accent-foreground': palette.neutral[900],
    'sidebar-border': palette.neutral[200],
    'sidebar-ring': palette.accent[700],
    brand: palette.brand[700],
    'brand-foreground': pureWhite,
    'brand-muted': palette.brand[50],
    'brand-emphasis': palette.brand[800],
    success: palette.success[700],
    'success-foreground': pureWhite,
    'success-muted': palette.success[50],
    warning: palette.warning[700],
    'warning-foreground': pureWhite,
    'warning-muted': palette.warning[50],
    // Informational is brand-toned; there is no separate info hue. See the note
    // where the `info` ramp used to be.
    info: palette.brand[700],
    'info-foreground': pureWhite,
    'info-muted': palette.brand[50],
    // The brand gradient is the mark's own move: deep navy rising into teal.
    // Two colours, one direction, no third hue and nothing warm.
    'gradient-from': palette.brand[800],
    'gradient-via': palette.brand[600],
    'gradient-to': palette.accent[500],
    // Teal has to step down to 700 to carry text at AA on paper — accent-500 is
    // 2.51:1. Same hue, legible end of the ramp.
    achievement: palette.accent[700],
    'achievement-foreground': pureWhite,
    'achievement-muted': palette.accent[50],
    // Theme-invariant by design — identical in the dark block below. This is
    // #0a2540, the identity navy itself.
    'brand-surface': palette.brand[900],
    'brand-surface-foreground': pureWhite,
    'brand-surface-muted': 'oklch(0.790 0.028 250)',
    'brand-surface-accent': palette.accent[400],
    'progress-track': palette.neutral[200],
  },
  dark: {
    // Deep navy-ink near-black (not pure black); surfaces step up in lightness.
    background: 'oklch(0.185 0.026 252)',
    foreground: palette.neutral[50],
    card: 'oklch(0.232 0.026 252)',
    'card-foreground': palette.neutral[50],
    popover: 'oklch(0.232 0.026 252)',
    'popover-foreground': palette.neutral[50],
    // Navy stays the primary in dark, one ramp step brighter so it separates
    // from the surface. White text on it, not ink: this is the same brand blue
    // the light theme uses, not a vivid fill needing dark type.
    primary: palette.brand[600],
    'primary-foreground': pureWhite,
    secondary: palette.neutral[800],
    'secondary-foreground': palette.neutral[50],
    muted: palette.neutral[800],
    'muted-foreground': palette.neutral[400],
    accent: palette.neutral[800],
    'accent-foreground': palette.neutral[50],
    // danger-400, not 500: as badge TEXT on a `destructive-muted` tint over a
    // card, 500 rendered at 4.10:1 — the pair gate cleared it at page level but
    // a card is a lighter surface underneath the tint.
    destructive: palette.danger[400],
    // Ink, not white: white on this fill is well under AA. Matches the dark
    // theme's own pattern of dark text on a vivid fill.
    'destructive-foreground': palette.neutral[950],
    'destructive-muted': alpha(palette.danger[500], 0.15),
    border: alpha(pureWhite, 0.09),
    input: alpha(pureWhite, 0.13),
    ring: palette.accent[400],
    'chart-1': palette.brand[400],
    'chart-2': palette.accent[400],
    'chart-3': palette.success[400],
    'chart-4': palette.warning[400],
    'chart-5': palette.danger[400],
    sidebar: 'oklch(0.208 0.026 252)',
    'sidebar-foreground': palette.neutral[200],
    'sidebar-primary': palette.brand[600],
    'sidebar-primary-foreground': pureWhite,
    'sidebar-accent': palette.neutral[800],
    'sidebar-accent-foreground': palette.neutral[50],
    'sidebar-border': alpha(pureWhite, 0.09),
    'sidebar-ring': palette.accent[400],
    // Navy cannot be read on a navy-ink surface, so `brand` climbs to the pale
    // end of its OWN ramp rather than switching to teal. The brand stays navy in
    // both themes; teal stays the accent in both. Swapping them by theme would
    // mean the product has no fixed answer to "which colour is Levrro".
    brand: palette.brand[300],
    'brand-foreground': palette.neutral[950],
    'brand-muted': alpha(palette.brand[400], 0.18),
    'brand-emphasis': palette.brand[200],
    success: palette.success[400],
    'success-foreground': palette.neutral[950],
    'success-muted': alpha(palette.success[500], 0.16),
    warning: palette.warning[400],
    'warning-foreground': palette.neutral[950],
    'warning-muted': alpha(palette.warning[500], 0.15),
    info: palette.brand[300],
    'info-foreground': palette.neutral[950],
    'info-muted': alpha(palette.brand[400], 0.18),
    'gradient-from': palette.brand[700],
    'gradient-via': palette.brand[500],
    'gradient-to': palette.accent[400],
    achievement: palette.accent[400],
    'achievement-foreground': palette.neutral[950],
    'achievement-muted': alpha(palette.accent[500], 0.16),
    // Identical to light on purpose: a committed brand surface that flipped with
    // the theme would not be committed to anything.
    'brand-surface': palette.brand[900],
    'brand-surface-foreground': pureWhite,
    'brand-surface-muted': 'oklch(0.790 0.028 250)',
    'brand-surface-accent': palette.accent[400],
    'progress-track': palette.neutral[800],
  },
}

/* -------------------------------------------------------------------------- */
/* Non-color scales.                                                          */
/* -------------------------------------------------------------------------- */

/** Base radius drives shadcn's derived sm/md/lg/xl scale in globals.css. */
export const radiusBase = '0.75rem'

export const radius = {
  none: '0',
  xs: '0.375rem',
  sm: '0.5rem',
  md: '0.625rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
} as const

/** Elevation. Soft, premium; deeper and cooler in dark. */
export const shadow = {
  light: {
    xs: '0 1px 2px 0 rgb(9 9 11 / 0.04)',
    sm: '0 1px 3px 0 rgb(9 9 11 / 0.06), 0 1px 2px -1px rgb(9 9 11 / 0.06)',
    md: '0 4px 12px -2px rgb(9 9 11 / 0.08), 0 2px 6px -2px rgb(9 9 11 / 0.05)',
    lg: '0 12px 32px -8px rgb(9 9 11 / 0.12), 0 4px 12px -4px rgb(9 9 11 / 0.08)',
    xl: '0 24px 48px -12px rgb(9 9 11 / 0.18)',
    // Teal halo (accent-500 = rgb(33 183 165)), not indigo and not navy: navy
    // glowing on navy is just a heavier shadow, while the teal reads as the
    // light the mark's rising triangle stands for.
    'brand-glow': '0 10px 34px -10px rgb(33 183 165 / 0.38)',
  },
  dark: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.4)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
    md: '0 4px 12px -2px rgb(0 0 0 / 0.5), 0 2px 6px -2px rgb(0 0 0 / 0.4)',
    lg: '0 12px 32px -8px rgb(0 0 0 / 0.6), 0 4px 12px -4px rgb(0 0 0 / 0.5)',
    xl: '0 24px 48px -12px rgb(0 0 0 / 0.7)',
    // Teal halo, slightly stronger for the darker surface.
    'brand-glow': '0 10px 34px -10px rgb(33 183 165 / 0.5)',
  },
} as const

/** Motion. Durations + easings shared by CSS, Tailwind and Motion. */
export const motion = {
  duration: {
    instant: '100ms',
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    // Lively settle via exponential ease-out (quint) — no overshoot/bounce,
    // which reads dated and undercuts the premium, calm brand.
    spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
} as const

/** Motion values as numbers/arrays for the Motion library (framer). */
export const motionValues = {
  duration: { instant: 0.1, fast: 0.15, base: 0.2, slow: 0.3, slower: 0.5 },
  easing: {
    standard: [0.4, 0, 0.2, 1],
    emphasized: [0.2, 0, 0, 1],
    decelerate: [0, 0, 0.2, 1],
    accelerate: [0.4, 0, 1, 1],
    spring: [0.22, 1, 0.36, 1],
  },
} as const

/**
 * Stacking order. The names are the contract; the numbers only have to preserve
 * the order below, which is derived from two rules rather than from intuition:
 *
 *   1. **A transient overlay must escape whatever it was opened from.** A menu
 *      that cannot get out from under a sticky header is a menu that disappears
 *      at the wrong viewport.
 *   2. **A transient overlay must also escape a MODAL**, because it can be
 *      opened from inside one. `add-application-dialog` contains a `Select`;
 *      with `dropdown` below `modal` its listbox rendered behind the dialog's
 *      own scrim — measured, not theorised: the pixel at the centre of the open
 *      listbox belonged to the overlay.
 *
 * So the persistent page furniture (docked → sticky → banner) sits at the
 * bottom, the modal pair above it, and everything transient above that in the
 * order it can nest: dropdown → popover → toast → tooltip.
 *
 * `dropdown` used to be 1000, below `sticky` at 1100 — the original scale put
 * the layers in alphabetical-ish order rather than in dependency order, and the
 * shadcn primitives all hardcoded `z-50` anyway, so nothing exercised it until
 * the primitives were moved onto these tokens.
 *
 * Anything with a hardcoded z-index is a bug; these names are the only source.
 */
export const zIndex = {
  base: 0,
  docked: 10,
  /** Page furniture that stays put: app header, marketing header, bottom nav. */
  sticky: 1000,
  banner: 1100,
  /** The modal scrim, and the modal itself one step above it. */
  overlay: 1200,
  modal: 1300,
  /** Transient overlays — above the modal, because they open from inside it. */
  dropdown: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
} as const

/** Layout dimensions (rem). */
export const layout = {
  'sidebar-width': '16rem',
  'sidebar-collapsed-width': '4.5rem',
  'header-height': '4rem',
  'bottom-nav-height': '4rem',
  'content-max-width': '80rem',
  'container-padding': '1.5rem',
} as const

/** Typography scale. Consumed by the Text/Heading primitives and Mantine. */
export const typography = {
  fontFamily: {
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)',
    heading: 'var(--font-heading)',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  lineHeight: {
    none: '1',
    tight: '1.15',
    snug: '1.35',
    normal: '1.5',
    relaxed: '1.65',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  letterSpacing: {
    tighter: '-0.03em',
    /** The floor. DESIGN.md's Geometric-Tracking Rule: never tighter than this. */
    tight: '-0.02em',
    normal: '0em',
    wide: '0.02em',
    /**
     * All-caps labels only.
     *
     * Capitals sit too close at default spacing — 14px Poppins 700 caps at 0%
     * ran "PROFESSIONAL EXPERIENCE" together into a solid block on the ATS CV
     * template. Short uppercase runs want 5-12%; this is the middle of that
     * band and is deliberately a token rather than a per-site arbitrary value,
     * because there are six uppercase sites and they were carrying four
     * different trackings between them.
     */
    caps: '0.08em',
  },
} as const

/** Breakpoints (px). Mobile-first. Consumed by useMediaQuery + Mantine. */
export const breakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof breakpoints
