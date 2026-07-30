import Link from 'next/link'

import { Icon } from '@/components/ui/icon'
import { ROUTES } from '@/lib/constants/routes'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export interface LogoProps {
  href?: string
  /** Hide the wordmark (used by the collapsed sidebar). */
  collapsed?: boolean
  /**
   * `onBrand` renders the wordmark white for committed brand surfaces (the
   * drenched marketing header), which are the same deep teal in both themes.
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
  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} home`}
      className={cn(
        'focus-visible:ring-ring flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2',
        className,
      )}
    >
      <span className="bg-gradient-brand shadow-brand-glow grid size-8 shrink-0 place-items-center rounded-lg text-white">
        <Icon name="sparkles" size="sm" variant="filled" />
      </span>
      {!collapsed ? (
        <span
          className={cn(
            'text-lg font-semibold tracking-tight',
            tone === 'onBrand' ? 'text-white' : 'text-foreground',
          )}
        >
          {siteConfig.name}
        </span>
      ) : null}
    </Link>
  )
}
