import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Text — the single primitive for body copy, labels and inline text.
 * Every typographic decision is a token-backed variant; no raw font sizes,
 * weights or colors are permitted at call sites.
 */
export const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      // Kept at full muted-foreground (not an opacity) to hold WCAG AA contrast.
      subtle: 'text-muted-foreground',
      brand: 'text-brand',
      success: 'text-success',
      warning: 'text-warning',
      danger: 'text-destructive',
      info: 'text-info',
      inverse: 'text-primary-foreground',
    },
    leading: {
      none: 'leading-none',
      tight: 'leading-tight',
      snug: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
    },
    tracking: {
      tight: 'tracking-tight',
      normal: 'tracking-normal',
      wide: 'tracking-wide',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    truncate: { true: 'truncate' },
    balance: { true: 'text-balance' },
    pretty: { true: 'text-pretty' },
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    tone: 'default',
    leading: 'normal',
  },
})

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  /** Element to render. Defaults to <p>. Use 'span' for inline. */
  as?: React.ElementType
}

export const Text = React.forwardRef<HTMLElement, TextProps>(function Text(
  {
    as: Comp = 'p',
    size,
    weight,
    tone,
    leading,
    tracking,
    align,
    truncate,
    balance,
    pretty,
    className,
    ...props
  },
  ref,
) {
  return (
    <Comp
      ref={ref}
      data-slot="text"
      className={cn(
        textVariants({ size, weight, tone, leading, tracking, align, truncate, balance, pretty }),
        className,
      )}
      {...props}
    />
  )
})
