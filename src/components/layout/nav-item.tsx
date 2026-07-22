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
