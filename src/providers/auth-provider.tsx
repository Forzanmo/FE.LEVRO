'use client'

import { ClerkProvider } from '@clerk/nextjs'

import { env } from '@/config/env'

/**
 * Clerk is only mounted when a publishable key is configured. Without one the
 * app falls through to the mock auth service, so it boots with zero setup and
 * keys can be added later without touching component code.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!env.isClerkEnabled) return <>{children}</>

  return <ClerkProvider publishableKey={env.clerkPublishableKey}>{children}</ClerkProvider>
}
