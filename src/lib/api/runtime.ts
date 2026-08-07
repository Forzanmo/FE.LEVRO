import { client } from '@/api/generated/client.gen'
import type { TokenResponse } from '@/api/generated/types.gen'

let accessToken: string | null = null
let refreshPromise: Promise<string | null> | null = null
const expirationListeners = new Set<() => void>()

const NO_REFRESH_PATHS = [
  '/api/v1/auth/token',
  '/api/v1/auth/register',
  '/api/v1/auth/refresh',
  '/api/v1/auth/password-reset',
]

export function setAccessToken(token: string | null): void {
  accessToken = token
}

/** Authenticated fetch for workspace endpoints not yet represented by the generated SDK. */
export async function authenticatedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers)
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
  const response = await fetch(input, { ...init, headers, credentials: 'include' })
  if (response.status !== 401) return response
  const token = await refreshAccessToken()
  if (!token) return response
  headers.set('Authorization', `Bearer ${token}`)
  headers.set('x-levrro-retry', '1')
  return fetch(input, { ...init, headers, credentials: 'include' })
}

export function subscribeToSessionExpiration(listener: () => void): () => void {
  expirationListeners.add(listener)
  return () => expirationListeners.delete(listener)
}

function notifySessionExpired(): void {
  expirationListeners.forEach((listener) => listener())
}

export async function refreshAccessToken(notifyOnFailure = true): Promise<string | null> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const response = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        setAccessToken(null)
        if (notifyOnFailure) notifySessionExpired()
        return null
      }

      const token = (await response.json()) as TokenResponse
      setAccessToken(token.access_token)
      return token.access_token
    } catch {
      setAccessToken(null)
      if (notifyOnFailure) notifySessionExpired()
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

client.setConfig({
  baseUrl: '',
  credentials: 'include',
  auth: () => accessToken ?? undefined,
  fetch: async (input, init) => {
    const request = input instanceof Request ? input : new Request(input, init)
    const replayable = request.clone()
    const response = await globalThis.fetch(request)

    if (response.status !== 401 || request.headers.has('x-levrro-retry')) return response

    const pathname = new URL(request.url, globalThis.location?.origin ?? 'http://localhost').pathname
    if (NO_REFRESH_PATHS.some((path) => pathname.startsWith(path))) return response

    const token = await refreshAccessToken()
    if (!token) return response

    const headers = new Headers(replayable.headers)
    headers.set('Authorization', `Bearer ${token}`)
    headers.set('x-levrro-retry', '1')
    return globalThis.fetch(new Request(replayable, { headers, credentials: 'include' }))
  },
})
