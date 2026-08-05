'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useSession } from '@/providers/session-provider'
import { ROUTES } from '@/lib/constants/routes'

/**
 * Guards the authenticated app surface. Unauthenticated users are sent to
 * sign-in; authenticated-but-not-onboarded users are sent to onboarding. While
 * the session resolves (SSR / first paint) children render, matching the server
 * output and avoiding a flash for the common signed-in case.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status, hasOnboarded } = useSession()
  const router = useRouter()

  const needsAuth = status === 'unauthenticated'
  const needsOnboarding = status === 'authenticated' && !hasOnboarded

  useEffect(() => {
    if (needsAuth) router.replace(ROUTES.signIn)
    else if (needsOnboarding) router.replace(ROUTES.onboarding)
  }, [needsAuth, needsOnboarding, router])

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
