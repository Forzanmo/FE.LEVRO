'use client'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { TooltipProvider } from '@/components/ui/tooltip'
import { PRIMARY_NAV, SECONDARY_NAV } from '@/lib/constants/navigation'
import { toggleSidebar, useAppDispatch, useAppSelector } from '@/stores'
import { cn } from '@/lib/utils'

import { Logo } from './logo'
import { NavItem } from './nav-item'

/** Expandable desktop sidebar (spec §4). Collapsed state lives in the UI store. */
export function Sidebar({ className }: { className?: string }) {
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed)
  const dispatch = useAppDispatch()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        data-collapsed={collapsed}
        style={{ width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }}
        className={cn(
          'bg-sidebar text-sidebar-foreground border-sidebar-border sticky top-0 hidden h-svh shrink-0 flex-col border-r transition-[width] duration-300 ease-[var(--ease-emphasized)] md:flex',
          className,
        )}
      >
        <div className={cn('flex h-16 items-center px-4', collapsed && 'justify-center px-0')}>
          <Logo collapsed={collapsed} />
        </div>

        <nav className="flex-1 space-y-1 overflow-x-hidden overflow-y-auto px-3 py-2" aria-label="Primary">
          {PRIMARY_NAV.map((item) => (
            <NavItem key={item.href} item={item} collapsed={collapsed} />
          ))}
        </nav>

        <div className="space-y-1 px-3 py-2">
          {SECONDARY_NAV.map((item) => (
            <NavItem key={item.href} item={item} collapsed={collapsed} />
          ))}
        </div>

        <div
          className={cn(
            'border-sidebar-border flex border-t p-3',
            collapsed ? 'justify-center' : 'justify-end',
          )}
        >
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-pressed={collapsed}
            onClick={() => dispatch(toggleSidebar())}
          >
            <Icon name="panel-left" size="sm" />
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
