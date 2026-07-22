/**
 * Mock auth session, persisted to localStorage. Stands in for Clerk (Google)
 * until keys are configured — the SessionProvider consumes this, so swapping to
 * real Clerk only touches the provider, not the screens.
 *
 * The default (first visit) is a signed-in, onboarded returning user so the app
 * is reviewable without a login wall; explicit sign-out flips it and drives the
 * real sign-in → onboarding → coach flow.
 */
export type AuthPlan = 'assets' | 'assets-roadmap'

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

  /** First-visit default: an onboarded returning user (keeps the app open). */
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
