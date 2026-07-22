'use client'

import { createContext, useContext, useMemo, useSyncExternalStore } from 'react'

import { authService, type AuthPlan, type SessionUser, type StoredSession } from '@/services/auth/auth-service'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface SessionContextValue {
  status: AuthStatus
  user: SessionUser | null
  hasOnboarded: boolean
  plan?: AuthPlan
  signIn: () => void
  signOut: () => void
  completeOnboarding: (plan: AuthPlan) => void
}

/* --------------------------------------------------------------------------
 * Client session store (localStorage-backed) exposed via useSyncExternalStore.
 * The server snapshot is `null` ("loading"), so the first client render matches
 * SSR with no hydration mismatch and no setState-in-effect.
 * ------------------------------------------------------------------------ */

let cache: StoredSession | null = null
let initialized = false
const listeners = new Set<() => void>()

function getSnapshot(): StoredSession {
  if (!initialized) {
    cache = authService.getSession() ?? authService.seedReturningUser()
    initialized = true
  }
  return cache as StoredSession
}

function getServerSnapshot(): StoredSession | null {
  return null
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}

function mutate(next: StoredSession): void {
  cache = next
  initialized = true
  listeners.forEach((l) => l())
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const session = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const value = useMemo<SessionContextValue>(
    () => ({
      status: session === null ? 'loading' : session.authenticated ? 'authenticated' : 'unauthenticated',
      user: session?.user ?? null,
      hasOnboarded: session?.hasOnboarded ?? false,
      plan: session?.plan,
      signIn: () => mutate(authService.signInWithGoogle()),
      signOut: () => mutate(authService.signOut()),
      completeOnboarding: (plan) => mutate(authService.completeOnboarding(plan)),
    }),
    [session],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within a SessionProvider')
  return ctx
}
