/**
 * Mock auth session, persisted to localStorage. Stands in for Clerk (Google)
 * until keys are configured — the SessionProvider consumes this, so swapping to
 * real Clerk only touches the provider, not the screens.
 *
 * **A first visit is signed OUT.** This used to seed an authenticated, onboarded
 * "returning user" so the app was reviewable without a login wall, and the cost
 * of that convenience was the entire top of the funnel: `/sign-in` and
 * `/onboarding` both redirected to `/dashboard`, every marketing CTA landed on a
 * populated dashboard, and no visitor could create an account — so the product
 * shipped with no way to acquire a user. It also greeted strangers by the name
 * of a person who is not them, on a product whose first principle is that trust
 * is earned through transparency.
 *
 * The reviewable-without-a-login-wall behaviour still exists, but it is now
 * opt-in via `NEXT_PUBLIC_DEMO_MODE=1` (see `config/env.ts`) rather than the
 * default that every real visitor gets.
 */
export type AuthPlan = 'cv' | 'cv-letters'

export interface SessionUser {
  id: string
  name: string
  email: string
  initials: string
}

export interface StoredSession {
  authenticated: boolean
  user: SessionUser | null
  hasOnboarded: boolean
  plan?: AuthPlan
}

const STORAGE_KEY = 'levvro:auth'

const DEMO_USER: SessionUser = {
  id: 'demo-user',
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  initials: 'AR',
}

function read(): StoredSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredSession) : null
  } catch {
    return null
  }
}

function write(session: StoredSession): StoredSession {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } catch {
      /* ignore quota errors */
    }
  }
  return session
}

export const authService = {
  getSession: read,

  /** The signed-out default for a first visit. Not persisted: writing it would
   *  be indistinguishable from a deliberate sign-out on the next read. */
  signedOut(): StoredSession {
    return { authenticated: false, user: null, hasOnboarded: false }
  },

  /** Demo mode only (`NEXT_PUBLIC_DEMO_MODE=1`): an onboarded returning user, so
   *  the whole product is browsable without a login wall. */
  seedReturningUser(): StoredSession {
    return write({ authenticated: true, user: DEMO_USER, hasOnboarded: true })
  },

  /** Mock "Continue with Google" — a fresh sign-in that still needs onboarding. */
  signInWithGoogle(): StoredSession {
    return write({ authenticated: true, user: DEMO_USER, hasOnboarded: false })
  },

  signOut(): StoredSession {
    return write({ authenticated: false, user: null, hasOnboarded: false })
  },

  /** Persist profile edits. Returns null when there is no session to update. */
  updateProfile(patch: { name: string }): StoredSession | null {
    const current = read()
    if (!current?.user) return null
    return write({ ...current, user: { ...current.user, name: patch.name } })
  },

  completeOnboarding(plan: AuthPlan): StoredSession {
    const current = read()
    return write({
      authenticated: true,
      user: current?.user ?? DEMO_USER,
      hasOnboarded: true,
      plan,
    })
  },
}
