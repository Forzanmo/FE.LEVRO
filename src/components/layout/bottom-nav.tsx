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
      /*
       * FULLY OPAQUE, and this is the third time the reasoning has been written
       * down. A translucent sticky bar composites over whatever happens to be
       * scrolling beneath it, so its effective background is unknowable and its
       * contrast cannot be proved. The floor moved from /70 to /88 the last time
       * this failed; /88 then failed too, on `/documents/*` at mobile, where
       * 12% of the sheet's chrome showing through dragged the nav labels to
       * 4.12:1 and the wordmark to 4.45:1.
       *
       * There is no translucency value that is provably safe, because the thing
       * underneath is arbitrary. Opaque is the only version of this bar whose
       * contrast is a fact rather than a hope. `backdrop-blur` goes with it —
       * there is nothing left to blur.
       */
      className="bg-background fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid h-full grid-cols-5">
        {MOBILE_NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                // Same reasoning as the sidebar (see `nav-item.tsx`): always on
                // screen, so the default prefetched the whole app from every
                // page — and this is the surface where the user is most likely
                // to be on mobile data.
                prefetch={false}
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
