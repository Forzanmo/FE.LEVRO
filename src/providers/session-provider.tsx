'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import {
  authService,
  signedOutSession,
  type AuthPlan,
  type Credentials,
  type SessionUser,
  type StoredSession,
} from '@/services/auth/auth-service'
import { subscribeToSessionExpiration } from '@/lib/api/runtime'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface SessionContextValue {
  status: AuthStatus
  user: SessionUser | null
  hasOnboarded: boolean
  plan?: AuthPlan
  profileData: Record<string, unknown>
  signIn: (credentials: Credentials) => Promise<void>
  register: (credentials: Credentials) => Promise<void>
  signOut: () => Promise<void>
  completeOnboarding: (plan: AuthPlan) => Promise<void>
  updateProfile: (patch: Record<string, unknown>) => Promise<void>
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(null)

  useEffect(() => {
    let active = true
    void authService.restore().then((restored) => {
      if (active) setSession(restored)
    })
    const unsubscribe = subscribeToSessionExpiration(() => setSession(signedOutSession))
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (credentials: Credentials) => {
    setSession(await authService.signIn(credentials))
  }, [])

  const register = useCallback(async (credentials: Credentials) => {
    setSession(await authService.register(credentials))
  }, [])

  const signOut = useCallback(async () => {
    setSession(await authService.signOut())
  }, [])

  const completeOnboarding = useCallback(
    async (plan: AuthPlan) => {
      if (!session) return
      setSession(await authService.completeOnboarding(session, plan))
    },
    [session],
  )

  const updateProfile = useCallback(
    async (patch: Record<string, unknown>) => {
      if (!session) return
      setSession(await authService.updateProfile(session, patch))
    },
    [session],
  )

  const value = useMemo<SessionContextValue>(
    () => ({
      status:
        session === null
          ? 'loading'
          : session.authenticated
            ? 'authenticated'
            : 'unauthenticated',
      user: session?.user ?? null,
      hasOnboarded: session?.hasOnboarded ?? false,
      plan: session?.plan,
      profileData: session?.profile?.data ?? {},
      signIn,
      register,
      signOut,
      completeOnboarding,
      updateProfile,
    }),
    [session, signIn, register, signOut, completeOnboarding, updateProfile],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext)
  if (!context) throw new Error('useSession must be used within a SessionProvider')
  return context
}
