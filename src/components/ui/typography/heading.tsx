import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Heading — display headings h1–h6. Semantic level (for a11y/document outline)
 * is decoupled from visual size, so you can render an <h2> that looks like a
 * large display without breaking the heading hierarchy.
 */
export const headingVariants = cva('font-heading font-semibold leading-tight tracking-tight', {
  variants: {
    size: {
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-4xl sm:text-5xl',
      '6xl': 'text-5xl sm:text-6xl',
    },
    tone: {
      default: 'text-foreground',
      brand: 'text-brand',
      inverse: 'text-primary-foreground',
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

const levelToSize: Record<HeadingLevel, NonNullable<VariantProps<typeof headingVariants>['size']>> =
  {
    1: '4xl',
    2: '3xl',
    3: '2xl',
    4: 'xl',
    5: 'lg',
    6: 'base',
  }

export interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>,
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
