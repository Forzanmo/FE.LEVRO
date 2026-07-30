import type { Page } from '@playwright/test'

/**
 * Journey seeding for E2E.
 *
 * Every history read — documents, the CV seed, applications — is gated on
 * `journeyStorage.hasAssessment()`, so a fresh browser context correctly sees
 * empty states. Tests that exercise populated surfaces have to say they are a
 * user who finished the assessment; before the gate existed they got the
 * fixtures for free, which is precisely the bug the gate fixes.
 *
 * Written via `addInitScript` so the value is present before the app's first
 * render, not after a reload.
 */
const JOURNEY_KEY = 'levvro:journey'

/** A user who completed the assessment and has already seen the dashboard. */
export async function seedAssessed(page: Page): Promise<void> {
  await page.addInitScript(
    ([key, state]) => {
      window.localStorage.setItem(key as string, state as string)
    },
    [
      JOURNEY_KEY,
      JSON.stringify({
        assessmentCompletedAt: '2026-01-01T00:00:00.000Z',
        dashboardSeenAt: '2026-01-01T00:05:00.000Z',
      }),
    ],
  )
}

/** A user who completed the assessment moments ago and has not seen the
 *  dashboard yet — the first-run window. */
export async function seedJustAssessed(page: Page): Promise<void> {
  await page.addInitScript(
    ([key, state]) => {
      window.localStorage.setItem(key as string, state as string)
    },
    [
      JOURNEY_KEY,
      JSON.stringify({
        assessmentCompletedAt: '2026-01-01T00:00:00.000Z',
        dashboardSeenAt: null,
      }),
    ],
  )
}
