/**
 * Levvro Design Tokens — single source of truth.
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
   * Primary brand — deep peacock TEAL. Intelligent, trustworthy, premium.
   * Deliberately not indigo/violet (the generic AI-SaaS tell), not LinkedIn
   * blue, not growth-green. This is Levvro's ownable signature. Authored in
   * OKLCH so lightness is intentional and the WCAG gate stays predictable.
   */
  brand: {
    50: 'oklch(0.984 0.009 195)',
    100: 'oklch(0.957 0.025 194)',
    200: 'oklch(0.916 0.050 193)',
    300: 'oklch(0.856 0.082 193)',
    400: 'oklch(0.768 0.106 193)',
    500: 'oklch(0.668 0.110 194)',
    600: 'oklch(0.560 0.100 195)',
    700: 'oklch(0.478 0.085 196)',
    800: 'oklch(0.405 0.068 198)',
    900: 'oklch(0.346 0.053 200)',
    950: 'oklch(0.258 0.040 202)',
  },
  /**
   * Accent — warm achievement GOLD. Carries the "confident & motivated"
   * emotion: momentum, your moment, golden hour. Used for the gradient's warm
   * terminus, highlights, and achievement/score moments — never as UI chrome.
   */
  accent: {
    50: 'oklch(0.985 0.020 92)',
    100: 'oklch(0.958 0.045 90)',
    200: 'oklch(0.918 0.085 88)',
    300: 'oklch(0.872 0.120 85)',
    400: 'oklch(0.822 0.142 82)',
    500: 'oklch(0.775 0.150 80)',
    600: 'oklch(0.705 0.142 76)',
    700: 'oklch(0.602 0.120 72)',
    800: 'oklch(0.502 0.098 68)',
    900: 'oklch(0.420 0.078 66)',
    950: 'oklch(0.302 0.056 64)',
  },
  /** Success — emerald. */
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
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
  /** Info — sky. */
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  /** Neutral — zinc. Surfaces, text, borders. */
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
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
  | 'gradient-from'
  | 'gradient-via'
  | 'gradient-to'
  | 'score-track'
  | 'score-low'
  | 'score-mid'
  | 'score-high'

type SemanticColorMap = Record<SemanticColorRole, string>

const alpha = (hex: string, a: number): string => {
  const v = hex.replace('#', '')
  const r = parseInt(v.slice(0, 2), 16)
  const g = parseInt(v.slice(2, 4), 16)
  const b = parseInt(v.slice(4, 6), 16)
  return `rgb(${r} ${g} ${b} / ${a})`
}

export const semanticColors: { light: SemanticColorMap; dark: SemanticColorMap } = {
  light: {
    // Near-white with a whisper of teal-cool (not warm) so white cards lift.
    background: 'oklch(0.985 0.006 200)',
    foreground: palette.neutral[950],
    card: pureWhite,
    'card-foreground': palette.neutral[950],
    popover: pureWhite,
    'popover-foreground': palette.neutral[950],
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
    ring: palette.brand[500],
    'chart-1': palette.brand[500],
    'chart-2': palette.accent[500],
    'chart-3': palette.info[500],
    'chart-4': palette.success[500],
    'chart-5': palette.warning[500],
    sidebar: palette.neutral[50],
    'sidebar-foreground': palette.neutral[900],
    'sidebar-primary': palette.brand[600],
    'sidebar-primary-foreground': pureWhite,
    'sidebar-accent': palette.neutral[100],
    'sidebar-accent-foreground': palette.neutral[900],
    'sidebar-border': palette.neutral[200],
    'sidebar-ring': palette.brand[500],
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
    info: palette.info[700],
    'info-foreground': pureWhite,
    'info-muted': palette.info[50],
    // Brand gradient: deep teal → bright aqua → warm gold (cool competence
    // warming to golden achievement). Doubles as the aurora sweep.
    'gradient-from': palette.brand[600],
    'gradient-via': palette.brand[400],
    'gradient-to': palette.accent[500],
    'score-track': palette.neutral[200],
    'score-low': palette.danger[500],
    'score-mid': palette.warning[500],
    'score-high': palette.success[500],
  },
  dark: {
    // Deep teal-ink near-black (not pure black); surfaces step up in lightness.
    background: 'oklch(0.175 0.016 210)',
    foreground: palette.neutral[50],
    card: 'oklch(0.223 0.016 212)',
    'card-foreground': palette.neutral[50],
    popover: 'oklch(0.223 0.016 212)',
    'popover-foreground': palette.neutral[50],
    // Vivid teal primary pops on the dark surface; dark ink text stays legible.
    primary: palette.brand[500],
    'primary-foreground': palette.neutral[950],
    secondary: palette.neutral[800],
    'secondary-foreground': palette.neutral[50],
    muted: palette.neutral[800],
    'muted-foreground': palette.neutral[400],
    accent: palette.neutral[800],
    'accent-foreground': palette.neutral[50],
    destructive: palette.danger[500],
    'destructive-foreground': pureWhite,
    'destructive-muted': alpha(palette.danger[500], 0.15),
    border: alpha(pureWhite, 0.08),
    input: alpha(pureWhite, 0.12),
    ring: palette.brand[500],
    'chart-1': palette.brand[400],
    'chart-2': palette.accent[400],
    'chart-3': palette.info[400],
    'chart-4': palette.success[400],
    'chart-5': palette.warning[400],
    sidebar: 'oklch(0.200 0.015 211)',
    'sidebar-foreground': palette.neutral[200],
    'sidebar-primary': palette.brand[500],
    'sidebar-primary-foreground': pureWhite,
    'sidebar-accent': palette.neutral[800],
    'sidebar-accent-foreground': palette.neutral[50],
    'sidebar-border': alpha(pureWhite, 0.08),
    'sidebar-ring': palette.brand[500],
    brand: palette.brand[300],
    'brand-foreground': pureWhite,
    'brand-muted': alpha(palette.brand[500], 0.15),
    'brand-emphasis': palette.brand[400],
    success: palette.success[500],
    'success-foreground': palette.neutral[950],
    'success-muted': alpha(palette.success[500], 0.15),
    warning: palette.warning[400],
    'warning-foreground': palette.neutral[950],
    'warning-muted': alpha(palette.warning[500], 0.15),
    info: palette.info[500],
    'info-foreground': pureWhite,
    'info-muted': alpha(palette.info[500], 0.15),
    'gradient-from': palette.brand[500],
    'gradient-via': palette.brand[400],
    'gradient-to': palette.accent[400],
    'score-track': palette.neutral[800],
    'score-low': palette.danger[500],
    'score-mid': palette.warning[400],
    'score-high': palette.success[500],
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
    // Teal halo (brand-600 = rgb(0 134 135)), not indigo — the identity, not the
    // generic-AI-SaaS purple this palette moved off.
    'brand-glow': '0 8px 32px -8px rgb(0 134 135 / 0.45)',
  },
  dark: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.4)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
    md: '0 4px 12px -2px rgb(0 0 0 / 0.5), 0 2px 6px -2px rgb(0 0 0 / 0.4)',
    lg: '0 12px 32px -8px rgb(0 0 0 / 0.6), 0 4px 12px -4px rgb(0 0 0 / 0.5)',
    xl: '0 24px 48px -12px rgb(0 0 0 / 0.7)',
    // Teal halo, slightly stronger for the darker surface.
    'brand-glow': '0 8px 32px -8px rgb(0 134 135 / 0.55)',
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

export const zIndex = {
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
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
    tight: '-0.02em',
    normal: '0em',
    wide: '0.02em',
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
