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
       *
       * It also carries the light-on-dark compensation. Light type on a dark
       * ground reads lighter and tighter than the same type on paper — the
       * perceived weight drops, and at the contrast these surfaces run (8:1 for
       * this copy, 15.5:1 for the heading above it) halation makes it worse, not
       * better. Measured before this: the hero subhead and the CTA body were
       * byte-identical to the same 18px/400 Geist on the light sections, on all
       * three axes. A hair of tracking and a looser leading put the perceived
       * weight back; the weight step is left to call sites that want it.
       */
      onBrand: 'text-white tracking-[0.01em] leading-relaxed',
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
    /*
     * The values are `ch`, but the READABILITY target is real characters, and
     * those are not the same unit. CSS `ch` is the advance of "0", which in
     * Geist is 1.487x the average advance of running lowercase prose — measured,
     * not assumed. So `max-w-[52ch]` was not ~52 characters per line, it was
     * ~77, over the 65-75 cap, on the hero subhead — the exact paragraph this
     * variant was introduced to fix. The comment recording that fix said "~76ch"
     * and was measuring the wrong thing.
     *
     * Each value below is the real-character target divided by 1.487.
     */
    measure: {
      /** ~67 real characters — running prose. */
      prose: 'max-w-[45ch]',
      /** ~54 real characters — intros and lead paragraphs, which read narrower. */
      lead: 'max-w-[36ch]',
      /** ~42 real characters — captions, helper text, empty-state copy. */
      tight: 'max-w-[28ch]',
      /** Opt out where the container already constrains the line. */
      none: '',
    },
    truncate: { true: 'truncate' },
    balance: { true: 'text-balance' },
    pretty: { true: 'text-pretty' },
  },
  /*
   * `leading` has NO default, deliberately.
   *
   * It used to default to `normal`, and cva emits variants in declaration order
   * — `leading` after `tone` — so tailwind-merge kept `leading-normal` and threw
   * away the `leading-relaxed` that `tone="onBrand"` sets for light-on-dark
   * compensation. Measured: both the compensated and uncompensated paragraphs on
   * the navy surfaces rendered line-height 27px (1.5), never the declared 1.65.
   * Half of that fix had never applied anywhere.
   *
   * With no default, Tailwind's own size-paired line-height applies unless a
   * caller or a tone asks for something else, which is what both wanted.
   */
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    tone: 'default',
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
