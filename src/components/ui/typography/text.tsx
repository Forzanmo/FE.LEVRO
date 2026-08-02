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
      /**
       * For committed brand surfaces (`bg-gradient-brand-deep`), which are the
       * SAME deep navy in both themes — so the colour must NOT be theme-reactive.
       * Replaces the old `inverse` tone (`primary-foreground`), which inverted
       * to near-black in dark mode on a surface that never changed.
       */
      onBrand: 'text-white',
      /** Sets no colour — the surrounding surface owns it. */
      inherit: '',
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
    /**
     * Line length. DESIGN.md caps prose at 65–75ch, but there was no variant
     * for it, so every call site improvised with whatever `max-w-*` felt right
     * — and the landing page's most important paragraph landed at ~76ch, over
     * the cap. `ch` units track the actual font, which `max-w-3xl` does not.
     */
    measure: {
      /** ~66ch — running prose. */
      prose: 'max-w-[66ch]',
      /** ~52ch — intros and lead paragraphs, which read better narrower. */
      lead: 'max-w-[52ch]',
      /** ~40ch — captions, helper text, empty-state copy. */
      tight: 'max-w-[40ch]',
      /** Opt out where the container already constrains the line. */
      none: '',
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
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
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
    measure,
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
        textVariants({
          size,
          weight,
          tone,
          leading,
          tracking,
          align,
          measure,
          truncate,
          balance,
          pretty,
        }),
        className,
      )}
      {...props}
    />
  )
})
