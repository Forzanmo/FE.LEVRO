import Link from 'next/link'

import { Icon } from '@/components/ui/icon'
import { ROUTES } from '@/lib/constants/routes'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export interface LogoProps {
  href?: string
  /** Hide the wordmark (used by the collapsed sidebar). */
  collapsed?: boolean
  className?: string
}

export function Logo({ href = ROUTES.home, collapsed = false, className }: LogoProps) {
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
        <span className="text-foreground text-lg font-semibold tracking-tight">
          {siteConfig.name}
        </span>
      ) : null}
    </Link>
  )
}
