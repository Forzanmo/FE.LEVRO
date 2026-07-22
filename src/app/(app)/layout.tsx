import { AuthGuard } from '@/components/auth/auth-guard'
import { AppShell } from '@/components/layout'

/** Layout for the authenticated product surface — guarded, then wrapped in the shell. */
export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  )
}
