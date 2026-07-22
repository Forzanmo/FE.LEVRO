import { AuroraBackdrop } from '@/components/shared/aurora-backdrop'
import { Logo } from '@/components/layout'
import { ThemeToggle } from '@/components/shared/theme-toggle'

/** Minimal centered chrome for auth + onboarding — no app sidebar. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      {/* Full-page animated brand gradient behind the centered card. */}
      <AuroraBackdrop />

      <header className="mx-auto flex h-16 w-full max-w-[var(--content-max-width)] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-8">{children}</main>
    </div>
  )
}
