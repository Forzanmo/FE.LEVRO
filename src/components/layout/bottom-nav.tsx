'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Icon } from '@/components/ui/icon'
import { MOBILE_NAV } from '@/lib/constants/navigation'
import { cn } from '@/lib/utils'

/** Mobile bottom navigation (spec §4). Hidden from md upwards. */
export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Primary"
      /*
       * `min-height`, not a fixed `height`. With `height` set AND
       * `pb-[env(safe-area-inset-bottom)]`, the safe-area padding was consumed
       * INSIDE the fixed height — so on any device with a home indicator (~34px)
       * the icon+label stack was left ~30px and clipped. The bar now grows by
       * the inset instead of eating into its own content.
       */
      style={{ minHeight: 'var(--bottom-nav-height)' }}
      // Opaque enough to be its own surface, for the same reason as the
      // marketing header: at /70 the active label composited onto whatever
      // happened to be scrolling underneath and measured 4.28:1.
      className="bg-background/95 supports-[backdrop-filter]:bg-background/88 fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid h-full grid-cols-5">
        {MOBILE_NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  // text-xs (on the ramp), and truncate so a long label cannot
                  // spill out of a fifth-of-viewport column.
                  'flex h-full flex-col items-center justify-center gap-1 px-1 text-xs font-medium transition-colors',
                  active ? 'text-brand' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon name={item.icon} size="sm" variant={active ? 'filled' : 'outline'} />
                <span className="w-full truncate text-center">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
