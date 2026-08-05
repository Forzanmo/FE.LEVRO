'use client'

import { useSyncExternalStore } from 'react'

import { journeyStorage } from '@/services/storage/journey-storage'

const emptySubscribe = () => () => {}

/**
 * Hydration-safe read of the assessment gate.
 *
 * `journeyStorage` reads localStorage, which does not exist on the server, so
 * reading it during render makes the server answer "no assessment" and the
 * client answer "yes" — a mismatch on every populated surface. `null` means
 * "not known yet"; callers render their pending state for it rather than
 * guessing.
 *
 * Built on `useSyncExternalStore` for the same reason `useMounted` is: it gives
 * a distinct server snapshot without a setState-in-effect, which cascades an
 * extra render on every screen that asks.
 *
 * The services gate themselves (see `documents-service`), so this is only for
 * views that need to say something *different* pre-assessment — pointing at the
 * coach instead of at an editor, say — not for hiding data.
 */
export function useHasAssessment(): boolean | null {
  return useSyncExternalStore<boolean | null>(
    emptySubscribe,
    () => journeyStorage.hasAssessment(),
    () => null,
  )
}
