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
      style={{ height: 'var(--bottom-nav-height)' }}
      className="bg-background/85 supports-[backdrop-filter]:bg-background/70 fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
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
                  'flex h-full flex-col items-center justify-center gap-1 text-[0.7rem] font-medium transition-colors',
                  active ? 'text-brand' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon name={item.icon} size="sm" variant={active ? 'filled' : 'outline'} />
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
