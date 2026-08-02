import { SkipLink } from '@/components/shared/skip-link'
import { AmbientBackdrop } from '@/components/shared/ambient-backdrop'

import { AppHeader } from './app-header'
import { BottomNav } from './bottom-nav'
import { Sidebar } from './sidebar'

/**
 * Authenticated application shell: persistent sidebar (desktop), sticky header,
 * scrolling content column, and bottom navigation (mobile). Mobile-first: the
 * content column reserves space for the bottom nav on small screens.
 *
 * The shell is transparent so the fixed `AmbientBackdrop` (and the themed
 * `<html>` base surface) shows through the content column — the app is never a
 * flat block of colour, matching the marketing surface's living background.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh">
      <SkipLink />
      <AmbientBackdrop />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main
          id="main-content"
          className="flex-1 pb-[calc(var(--bottom-nav-height)+1.5rem)] md:pb-10"
        >
          <div className="mx-auto w-full max-w-[var(--content-max-width)] px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
