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

  if (status === 'loading' || needsAuth || needsOnboarding) return null
  return <>{children}</>
}
