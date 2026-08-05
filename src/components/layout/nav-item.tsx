'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Icon } from '@/components/ui/icon'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { NavItem as NavItemType } from '@/lib/constants/navigation'
import { cn } from '@/lib/utils'

function useIsActive(href: string): boolean {
  const pathname = usePathname()
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function NavItem({ item, collapsed = false }: { item: NavItemType; collapsed?: boolean }) {
  const active = useIsActive(item.href)

  const link = (
    <Link
      href={item.href}
      /*
       * No prefetch. The sidebar is in the `(app)` layout, so every one of its
       * links is in the viewport on every screen — and Next prefetches
       * viewport-visible links by default. Measured: an app route transferred
       * 254.5KB of JavaScript at load and then a further 307.6KB (+121%) as the
       * nav pulled all seven sibling routes, on every navigation, whether or not
       * the user ever went there. On a metered connection that is most of the
       * page's cost spent on pages nobody asked for.
       *
       * Hover still prefetches — Next falls back to prefetching on hover/touch
       * when `prefetch={false}` — so a deliberate click keeps its head start.
       * In-content links (the dashboard's "Add evidence to your CV", the
       * documents rows) keep the default, because there the intent is real.
       */
      prefetch={false}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors',
        'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
        'focus-visible:ring-sidebar-ring focus-visible:ring-2',
        active && 'bg-sidebar-accent text-sidebar-foreground',
        collapsed && 'justify-center px-0',
      )}
    >
      {active ? (
        <span
          className="bg-sidebar-primary absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full"
          aria-hidden="true"
        />
      ) : null}
      <Icon
        name={item.icon}
        size="sm"
        variant={active ? 'filled' : 'outline'}
        className={cn(active && 'text-sidebar-primary')}
      />
      {!collapsed ? <span className="truncate">{item.label}</span> : null}
    </Link>
  )

  if (!collapsed) return link

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  )
}
