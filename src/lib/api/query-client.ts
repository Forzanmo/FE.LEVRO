import { QueryClient, isServer } from '@tanstack/react-query'

/**
 * TanStack Query client factory.
 *
 * A fresh client is created per server request; the browser reuses a single
 * long-lived client. Defaults favour a snappy, low-chatter UX: data is fresh
 * for a minute, no refetch on window focus, one retry.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient()
  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}
