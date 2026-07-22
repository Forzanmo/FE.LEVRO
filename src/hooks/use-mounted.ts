import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

/**
 * True only after client mount, false during SSR / first paint — without a
 * setState-in-effect. Use to gate rendering of client-only values (e.g. the
 * resolved theme) so they don't cause a hydration mismatch.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}
