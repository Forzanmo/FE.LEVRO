'use client'

import dynamic from 'next/dynamic'

import { env } from '@/config/env'

/**
 * Clerk is only mounted when a publishable key is configured. Without one the
 * app falls through to the mock auth service, so it boots with zero setup and
 * keys can be added later without touching component code.
 *
 * The import is LAZY, and that is the whole point of this file's shape. A plain
 * `import { ClerkProvider } from '@clerk/nextjs'` puts Clerk in the module graph
 * of the root layout — which is every route. Measured at 185–256KB of loaded
 * chunks on the landing page, the sign-in page and every app screen, all to
 * render a bare fragment. The early-return guard below does not help on its own:
 * the branch is decided at runtime, but the download already happened at parse
 * time.
 *
 * `ssr: false` because Clerk's provider is browser-only. It means that if a key
 * IS configured, children wait one chunk-load before first paint — the right
 * trade for a provider whose context they would otherwise read before it exists.
 * With no key, `ClerkProvider` is never rendered and the chunk is never fetched.
 */
const ClerkProvider = dynamic(() => import('@clerk/nextjs').then((m) => m.ClerkProvider), {
  ssr: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!env.isClerkEnabled) return <>{children}</>

  return <ClerkProvider publishableKey={env.clerkPublishableKey}>{children}</ClerkProvider>
}
