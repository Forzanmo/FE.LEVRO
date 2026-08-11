import {
  getProfileApiV1ProfileGet,
  loginApiV1AuthTokenPost,
  logoutApiV1AuthLogoutPost,
  meApiV1AuthMeGet,
  registerApiV1AuthRegisterPost,
  updateProfileApiV1ProfilePatch,
} from '@/api/generated'
import type { ProfileResponse, UserResponse } from '@/api/generated'
import { unwrapApiResult } from '@/lib/api/http-client'
import { refreshAccessToken, setAccessToken } from '@/lib/api/runtime'

export type AuthPlan = 'cv' | 'cv-letters'

export interface SessionUser {
  id: string
  name: string
  email: string
  initials: string
  emailVerified: boolean
  isAdmin: boolean
}

export interface StoredSession {
  authenticated: boolean
  user: SessionUser | null
  hasOnboarded: boolean
  plan?: AuthPlan
  profile?: ProfileResponse
}

export interface Credentials {
  email: string
  password: string
}

export interface RegistrationCredentials extends Credentials {
  first_name: string
  last_name: string
}

export const signedOutSession: StoredSession = {
  authenticated: false,
  user: null,
  hasOnboarded: false,
}

function displayName(email: string, profile: ProfileResponse): string {
  const configured = profile.data.full_name
  if (typeof configured === 'string' && configured.trim()) return configured.trim()
  return email.split('@')[0]?.replace(/[._-]+/g, ' ') || 'Levrro user'
}

function toSession(user: UserResponse, profile: ProfileResponse): StoredSession {
  const name = displayName(user.email, profile)
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return {
    authenticated: true,
    user: {
      id: user.id,
      name,
      email: user.email,
      initials: initials || 'LU',
      emailVerified: user.email_verified,
      isAdmin: user.is_admin ?? false,
    },
    hasOnboarded: profile.data.onboarding_completed === true,
    plan:
      profile.data.plan === 'cv' || profile.data.plan === 'cv-letters'
        ? profile.data.plan
        : undefined,
    profile,
  }
}

async function fetchSession(): Promise<StoredSession> {
  const [userResult, profileResult] = await Promise.all([
    meApiV1AuthMeGet(),
    getProfileApiV1ProfileGet(),
  ])
  return toSession(unwrapApiResult(userResult), unwrapApiResult(profileResult))
}

export const authService = {
  async restore(): Promise<StoredSession> {
    const token = await refreshAccessToken(false)
    if (!token) return signedOutSession

    try {
      return await fetchSession()
    } catch {
      setAccessToken(null)
      return signedOutSession
    }
  },

  async signIn(credentials: Credentials): Promise<StoredSession> {
    const token = unwrapApiResult(
      await loginApiV1AuthTokenPost({ body: credentials }),
    )
    setAccessToken(token.access_token)
    return fetchSession()
  },

  async register(credentials: RegistrationCredentials): Promise<StoredSession> {
    unwrapApiResult(await registerApiV1AuthRegisterPost({ body: credentials }))
    return this.signIn(credentials)
  },

  async signOut(): Promise<StoredSession> {
    try {
      unwrapApiResult(await logoutApiV1AuthLogoutPost())
    } finally {
      setAccessToken(null)
    }
    return signedOutSession
  },

  async completeOnboarding(session: StoredSession, plan: AuthPlan): Promise<StoredSession> {
    if (!session.profile) throw new Error('Profile is not available.')
    const profile = unwrapApiResult(
      await updateProfileApiV1ProfilePatch({
        body: {
          expected_revision: session.profile.revision,
          data: {
            ...session.profile.data,
            onboarding_completed: true,
            plan,
          },
        },
      }),
    )
    if (!session.user) return signedOutSession
    return toSession(
      {
        id: session.user.id,
        email: session.user.email,
        email_verified: session.user.emailVerified,
        is_admin: session.user.isAdmin,
        created_at: new Date().toISOString(),
      },
      profile,
    )
  },

  async updateProfile(session: StoredSession, patch: Record<string, unknown>): Promise<StoredSession> {
    if (!session.profile || !session.user) throw new Error('Profile is not available.')
    const profile = unwrapApiResult(
      await updateProfileApiV1ProfilePatch({
        body: {
          expected_revision: session.profile.revision,
          data: { ...session.profile.data, ...patch },
        },
      }),
    )
    return toSession(
      {
        id: session.user.id,
        email: session.user.email,
        email_verified: session.user.emailVerified,
        is_admin: session.user.isAdmin,
        created_at: new Date().toISOString(),
      },
      profile,
    )
  },
}
