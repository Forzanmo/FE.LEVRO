import { Toaster } from '@/components/ui/sonner'

import { AuthProvider } from './auth-provider'
import { QueryProvider } from './query-provider'
import { SessionProvider } from './session-provider'
import { StoreProvider } from './store-provider'
import { ThemeProvider } from './theme-provider'

/**
 * Root composition of every client provider, in dependency order:
 *   Store → Query → Auth → Theme → app.
 *
 * Styling is a single system — Tailwind v4 + shadcn/Radix. The former Mantine /
 * Theme UI / Emotion appearance bridge (which nothing consumed) has been
 * removed. Kept as a Server Component so server-rendered children pass straight
 * through; each individual provider opts into the client boundary itself.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <QueryProvider>
        <AuthProvider>
          <ThemeProvider>
            <SessionProvider>{children}</SessionProvider>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </QueryProvider>
    </StoreProvider>
  )
}
