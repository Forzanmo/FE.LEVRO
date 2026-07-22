import * as React from 'react'
import type { LucideProps } from 'lucide-react'

import { cn } from '@/lib/utils'

import { iconRegistry, type IconName } from './registry'

/**
 * Unified Icon component (spec §13). A single, accessible entry point for all
 * iconography — call sites reference a semantic `name`, never a Lucide import.
 *
 * Lucide is a stroke icon set; `variant` maps each name to the closest faithful
 * rendering rather than inventing glyphs that do not exist:
 *   outline  → default stroke
 *   rounded  → slightly heavier stroke, round joins
 *   filled   → solid silhouette (fill, no stroke)
 *   duotone  → tinted fill + full stroke (two-tone)
 */
export const ICON_SIZES = { xs: 14, sm: 16, md: 20, lg: 24, xl: 32 } as const

export type IconSize = keyof typeof ICON_SIZES | number
export type IconVariant = 'outline' | 'rounded' | 'filled' | 'duotone'
export type IconTone =
  | 'current'
  | 'foreground'
  | 'muted'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

const toneClass: Record<IconTone, string> = {
  current: '',
  foreground: 'text-foreground',
  muted: 'text-muted-foreground',
  brand: 'text-brand',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-destructive',
  info: 'text-info',
}

const variantAttrs = (variant: IconVariant, strokeWidth?: number): Partial<LucideProps> => {
  switch (variant) {
    case 'rounded':
      return { fill: 'none', strokeWidth: strokeWidth ?? 2.4 }
    case 'filled':
      return { fill: 'currentColor', stroke: 'none', strokeWidth: 0 }
    case 'duotone':
      return { fill: 'currentColor', fillOpacity: 0.18, strokeWidth: strokeWidth ?? 2 }
    case 'outline':
    default:
      return { fill: 'none', strokeWidth: strokeWidth ?? 2 }
  }
}

export interface IconProps
  extends Omit<LucideProps, 'ref' | 'size' | 'color' | 'strokeWidth' | 'name'> {
  name: IconName
  size?: IconSize
  variant?: IconVariant
  tone?: IconTone
  strokeWidth?: number
  /**
   * Accessible label. When provided the icon is exposed to assistive tech as an
   * image; when omitted the icon is treated as decorative (aria-hidden).
   */
  label?: string
}

export function Icon({
  name,
  size = 'md',
  variant = 'outline',
  tone = 'current',
  strokeWidth,
  label,
  className,
  ...props
}: IconProps) {
  const LucideGlyph = iconRegistry[name]
  const px = typeof size === 'number' ? size : ICON_SIZES[size]

  const a11y = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true, focusable: false as const }

  return (
    <LucideGlyph
      width={px}
      height={px}
      className={cn('shrink-0', toneClass[tone], className)}
      {...variantAttrs(variant, strokeWidth)}
      {...a11y}
      {...props}
    />
  )
}
