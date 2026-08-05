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

interface ApiResult<T> {
  data?: T
  error?: unknown
  response?: Response
}

function errorMessage(body: unknown, fallback: string): string {
  if (typeof body === 'string' && body) return body
  if (body && typeof body === 'object') {
    const nestedError = 'error' in body ? body.error : undefined
    if (nestedError && typeof nestedError === 'object' && 'message' in nestedError) {
      const nestedMessage = nestedError.message
      if (typeof nestedMessage === 'string') return nestedMessage
    }
    const detail = 'detail' in body ? body.detail : undefined
    if (typeof detail === 'string') return detail
    const message = 'message' in body ? body.message : undefined
    if (typeof message === 'string') return message
  }
  return fallback
}

/** Convert a generated-client result into data or the app's standard error. */
export function unwrapApiResult<T>(result: ApiResult<T>): T {
  if (result.data !== undefined) return result.data
  const status = result.response?.status ?? 0
  throw new ApiError(status, errorMessage(result.error, 'The request could not be completed.'), result.error)
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: 'include',
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
    throw new ApiError(response.status, errorMessage(body, response.statusText), body)
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
