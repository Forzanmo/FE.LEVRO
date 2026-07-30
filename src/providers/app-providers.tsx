import { Toaster } from '@/components/ui/sonner'

import { AuthProvider } from './auth-provider'
import { QueryProvider } from './query-provider'
import { SessionProvider } from './session-provider'
import { ThemeProvider } from './theme-provider'

/**
 * Root composition of every client provider, in dependency order:
 *   Query → Auth → Theme → Session → app.
 *
 * Styling is a single system — Tailwind v4 + shadcn/Radix. The former Mantine /
 * Theme UI / Emotion appearance bridge (which nothing consumed) has been
 * removed. Kept as a Server Component so server-rendered children pass straight
 * through; each individual provider opts into the client boundary itself.
 *
 * There is no Redux store here any more. It held one boolean for one component
 * (see `layout/sidebar.tsx`) and two fields nothing read, and it was mounted
 * above every route to do it. A provider at the root is the most expensive place
 * in the app to put anything: whatever it imports, every visitor downloads.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>
          <SessionProvider>{children}</SessionProvider>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
