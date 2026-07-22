import { env } from '@/config/env'

/** Error thrown for non-2xx responses, carrying status + parsed body. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const BASE_URL = `${env.appUrl}/api`

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    let body: unknown
    try {
      body = await response.json()
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(response.status, response.statusText, body)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

/**
 * The single low-level HTTP entry point. Domain services in `services/` build on
 * top of this; UI never calls fetch or this client directly.
 */
export const httpClient = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: 'GET' }),
  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: 'DELETE' }),
}
