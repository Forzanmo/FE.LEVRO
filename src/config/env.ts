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
  /**
   * Browse the whole product without signing in, as an onboarded demo user.
   *
   * Opt-in on purpose. This was the default, and it meant `/sign-in` and
   * `/onboarding` were unreachable and nobody could create an account. A review
   * convenience must never be the thing a real visitor gets.
   */
  isDemoMode: process.env.NEXT_PUBLIC_DEMO_MODE === '1',
} as const

export type Env = typeof env
