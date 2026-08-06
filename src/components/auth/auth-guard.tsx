'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useSession } from '@/providers/session-provider'
import { ROUTES } from '@/lib/constants/routes'

/**
 * Guards the authenticated app surface. Unauthenticated users are sent to
 * sign-in; authenticated-but-not-onboarded users are sent to onboarding. The
 * protected surface waits for session restoration so forms cannot mount with
 * incomplete user data and then discard early input when the session resolves.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status, user, hasOnboarded } = useSession()
  const router = useRouter()

  const needsAuth = status === 'unauthenticated'
  const needsOnboarding = status === 'authenticated' && !user?.isAdmin && !hasOnboarded

  useEffect(() => {
    if (needsAuth) router.replace(ROUTES.signIn)
    else if (needsOnboarding) router.replace(ROUTES.onboarding)
  }, [needsAuth, needsOnboarding, router])

  if (status === 'loading') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-svh items-center justify-center px-6"
      >
        <span className="text-muted-foreground text-sm">Loading your account…</span>
      </div>
    )
  }

  /*
   * Returning `null` here emptied the page with no announcement: a screen-reader
   * user got silence, and everyone got a blank flash, while the redirect
   * resolved. A named status region says what is happening instead.
   */
  if (needsAuth || needsOnboarding) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-svh items-center justify-center px-6"
      >
        <span className="text-muted-foreground text-sm">
          {needsAuth ? 'Taking you to sign in…' : 'Setting up your account…'}
        </span>
      </div>
    )
  }
  return <>{children}</>
}
