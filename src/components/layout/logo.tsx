import Link from 'next/link'

import { BrandMark } from '@/components/layout/brand-mark'
import { ROUTES } from '@/lib/constants/routes'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export interface LogoProps {
  href?: string
  /** Hide the wordmark (used by the collapsed sidebar). */
  collapsed?: boolean
  /**
   * `onBrand` renders the lockup white for committed brand surfaces (the
   * drenched marketing header), which are the same deep navy in both themes.
   *
   * A prop rather than a blanket `[&_*]:text-white` on the parent: that
   * descendant selector out-specifies any child's own colour, which would also
   * have whitened the white "Get started" button's label into invisibility.
   */
  tone?: 'default' | 'onBrand'
  className?: string
}

export function Logo({
  href = ROUTES.home,
  collapsed = false,
  tone = 'default',
  className,
}: LogoProps) {
  const onBrand = tone === 'onBrand'

  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} home`}
      className={cn(
        /*
         * `min-h-9`, because the box is the target. The mark is 24px wide and
         * therefore only ~21px tall, and the wordmark's cap height is smaller
         * still — the whole link measured 91×19, under WCAG 2.2 SC 2.5.8's 24px
         * floor, on every page that renders it. The previous lockup cleared the
         * floor by accident: its 32px gradient chip was doing the job the hit
         * area should have been doing.
         */
        'focus-visible:ring-ring flex min-h-9 items-center gap-2.5 rounded-md outline-none focus-visible:ring-2',
        className,
      )}
    >
      {/*
       * The mark, unboxed. It used to be a generic sparkles glyph inside a
       * gradient rounded chip — a placeholder that said "AI startup" rather than
       * "Levrro", and the chip existed only to give the glyph something to sit
       * in. A real mark needs no container.
       */}
      <BrandMark tone={onBrand ? 'onBrand' : 'auto'} className="w-6" />

      {!collapsed ? (
        <span
          className={cn(
            'font-heading text-lg leading-none font-semibold tracking-[-0.01em]',
            onBrand ? 'text-white' : 'text-foreground',
          )}
        >
          {/*
           * The identity's wordmark sets its final letter in teal. Carrying that
           * into the product ties the lockup to the mark's apex triangle and
           * gives the accent one guaranteed appearance on every screen — the
           * scarcity the palette depends on works better when the one place it
           * always shows is the brand's own name.
           */}
          Levvr
          <span className={onBrand ? 'text-brand-surface-accent' : 'text-achievement'}>o</span>
        </span>
      ) : null}
    </Link>
  )
}
