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
 *
 * Tracking was retuned when the heading face became Poppins. The old values
 * were cut for Geist, a neo-grotesque with tight apertures that tolerates
 * −0.032em at display sizes. Poppins is a geometric: circular bowls, wide
 * sidebearings, and `o`/`e`/`c` that touch their neighbours long before Geist
 * would. Every display step relaxes by roughly a third, and the mobile end of
 * each clamp comes down so a hero headline still lands in two to four lines on
 * a 375px screen instead of four to six.
 */
export const headingVariants = cva('font-heading font-semibold', {
  variants: {
    size: {
      // Product scale — fixed rem, tracking relaxes as size drops.
      base: 'text-base leading-snug tracking-normal',
      lg: 'text-lg leading-snug tracking-normal',
      xl: 'text-xl leading-snug tracking-normal',
      '2xl': 'text-2xl leading-snug tracking-[-0.008em]',
      '3xl': 'text-3xl leading-tight tracking-[-0.014em]',
      '4xl': 'text-4xl leading-tight tracking-[-0.016em]',
      '5xl': 'text-4xl leading-[1.1] tracking-[-0.018em] sm:text-5xl',
      '6xl': 'text-5xl leading-[1.06] tracking-[-0.02em] sm:text-6xl',

      // Marketing scale — fluid, wider steps (2.25 → 3 → 3.5rem at max).
      'display-sm': 'text-[clamp(1.625rem,1.15rem+2.1vw,2.25rem)] leading-[1.16] tracking-[-0.012em]',
      'display-md': 'text-[clamp(1.875rem,1.25rem+3vw,3rem)] leading-[1.12] tracking-[-0.016em]',
      'display-lg': 'text-[clamp(2.125rem,1.3rem+4.2vw,3.5rem)] leading-[1.08] tracking-[-0.02em]',
    },
    tone: {
      default: 'text-foreground',
      brand: 'text-brand',
      /**
       * For committed brand surfaces (`bg-gradient-brand-deep`), which are the
       * SAME deep navy in both themes. Deliberately `text-white` rather than a
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
