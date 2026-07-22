/**
 * Typed access to public runtime configuration.
 *
 * Only `NEXT_PUBLIC_*` values live here — they are safe for the browser bundle.
 * Server-only secrets must be read directly from `process.env` inside server
 * code, never through this module.
 */
export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '',
  /** Auth is only mounted when a Clerk key is present; otherwise the app runs
   *  against the mock auth service so it boots with zero configuration. */
  isClerkEnabled: Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
  isDev: process.env.NODE_ENV === 'development',
} as const

export type Env = typeof env
