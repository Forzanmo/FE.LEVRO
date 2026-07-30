import { AuroraBackdrop } from '@/components/shared/aurora-backdrop'
import { Logo } from '@/components/layout'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Icon, type IconName } from '@/components/ui/icon'
import { Heading, Text } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

export interface StatusPageProps {
  icon?: IconName
  /**
   * `warning` for something that went wrong, `neutral` for something merely
   * absent. A dead link is not a fault — painting an amber warning disc on it
   * tells an already-anxious user they broke something when they clicked a
   * stale bookmark.
   */
  tone?: 'warning' | 'neutral'
  title: string
  description: string
  /** Buttons. One primary, at most one secondary. */
  actions: React.ReactNode
  /** Small print under the actions — a reference code, a reassurance. */
  footnote?: React.ReactNode
}

/**
 * The shell for the two pages a user only ever reaches by accident: a dead URL
 * and a crash.
 *
 * It carries its own chrome rather than reusing the app shell, because both can
 * fire outside `(app)` — a bad link from an email, or a render error that took
 * the sidebar down with it. Same backdrop, logo, and theme toggle as the auth
 * surface, so an error still looks like Levvro instead of like the framework's
 * default black-on-white, which is what a dead route used to render.
 */
export function StatusPage({
  icon = 'warning',
  tone = 'warning',
  title,
  description,
  actions,
  footnote,
}: StatusPageProps) {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <AuroraBackdrop />

      <header className="mx-auto flex h-16 w-full max-w-[var(--content-max-width)] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <span
            className={cn(
              'grid size-12 place-items-center rounded-full',
              tone === 'warning'
                ? 'bg-warning-muted text-warning'
                : 'bg-muted text-muted-foreground',
            )}
          >
            <Icon name={icon} size="lg" />
          </span>

          <div className="space-y-2">
            <Heading level={1} size="3xl">
              {title}
            </Heading>
            <Text tone="muted" className="text-pretty">
              {description}
            </Text>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">{actions}</div>

          {footnote ? (
            <Text tone="muted" size="sm" className="mt-1">
              {footnote}
            </Text>
          ) : null}
        </div>
      </main>
    </div>
  )
}
