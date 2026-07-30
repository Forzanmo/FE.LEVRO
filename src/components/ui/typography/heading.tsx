import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Heading — display headings h1–h6. Semantic level (for a11y/document outline)
 * is decoupled from visual size, so you can render an <h2> that looks like a
 * large display without breaking the heading hierarchy.
 *
 * Leading and tracking are per-size, not global.
 *
 * The base class used to hardcode `leading-tight tracking-tight` for every size
 * from 60px down to 16px. Two things were wrong with that. Display type wants
 * tighter leading than 1.15 and needs negative tracking to stop looking loose;
 * 16px card titles and 18px UI headings want neither, and DESIGN.md specifies
 * Title at `letterSpacing: normal` — they were getting −0.02em, which costs
 * legibility at UI sizes for an audience that is already stressed.
 *
 * The `display-*` sizes are the marketing scale: fluid `clamp()` with ≥1.25
 * steps, as the brand register asks for. The rem sizes are the product scale:
 * fixed, ~1.125–1.2 steps, because a heading that shrinks inside a sidebar
 * looks worse, not better. One primitive, two deliberately different systems —
 * previously the landing page and the dashboard shared one scale, so the hero's
 * only move was "bigger Geist".
 */
export const headingVariants = cva('font-heading font-semibold', {
  variants: {
    size: {
      // Product scale — fixed rem, tracking relaxes as size drops.
      base: 'text-base leading-snug tracking-normal',
      lg: 'text-lg leading-snug tracking-normal',
      xl: 'text-xl leading-snug tracking-[-0.01em]',
      '2xl': 'text-2xl leading-snug tracking-[-0.015em]',
      '3xl': 'text-3xl leading-tight tracking-[-0.02em]',
      '4xl': 'text-4xl leading-tight tracking-[-0.02em]',
      '5xl': 'text-4xl leading-[1.1] tracking-[-0.025em] sm:text-5xl',
      '6xl': 'text-5xl leading-[1.06] tracking-[-0.03em] sm:text-6xl',

      // Marketing scale — fluid, wider steps (2.25 → 3 → 3.75rem at max).
      'display-sm': 'text-[clamp(1.75rem,1.2rem+2.4vw,2.25rem)] leading-[1.12] tracking-[-0.02em]',
      'display-md': 'text-[clamp(2.25rem,1.4rem+3.6vw,3rem)] leading-[1.08] tracking-[-0.025em]',
      'display-lg': 'text-[clamp(2.75rem,1.5rem+5.2vw,3.75rem)] leading-[1.04] tracking-[-0.032em]',
    },
    tone: {
      default: 'text-foreground',
      brand: 'text-brand',
      /**
       * For committed brand surfaces (`bg-gradient-brand-deep`), which are the
       * SAME dark teal in both themes. Deliberately `text-white` rather than a
       * theme-reactive token: the old `inverse` tone mapped to
       * `primary-foreground`, which flips to near-black in dark mode and made
       * the marketing CTA heading unreadable on its own band.
       */
      onBrand: 'text-white',
      /** Sets no colour — the surrounding surface owns it. */
      inherit: '',
    },
    tracking: {
      tighter: 'tracking-tighter',
      tight: 'tracking-tight',
      normal: 'tracking-normal',
    },
    balance: { true: 'text-balance' },
  },
  defaultVariants: {
    size: '2xl',
    tone: 'default',
    balance: true,
  },
})

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

const levelToSize: Record<
  HeadingLevel,
  NonNullable<VariantProps<typeof headingVariants>['size']>
> = {
  1: '4xl',
  2: '3xl',
  3: '2xl',
  4: 'xl',
  5: 'lg',
  6: 'base',
}

export interface HeadingProps
  extends
    Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof headingVariants> {
  /** Semantic heading level (renders h1–h6). Defaults to 2. */
  level?: HeadingLevel
  /** Override the rendered element without changing visual size. */
  as?: React.ElementType
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level = 2, as, size, tone, tracking, balance, className, ...props },
  ref,
) {
  const Comp = (as ?? (`h${level}` as React.ElementType)) as React.ElementType
  const resolvedSize = size ?? levelToSize[level]

  return (
    <Comp
      ref={ref}
      data-slot="heading"
      className={cn(headingVariants({ size: resolvedSize, tone, tracking, balance }), className)}
      {...props}
    />
  )
})
