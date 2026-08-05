import { expect, test } from '@playwright/test'

import { seedAssessed } from './support/journey'

/**
 * A first visit is signed out. These are the regression tests for that: the app
 * used to seed an authenticated, onboarded user on first paint, which made
 * `/sign-in` and `/onboarding` unreachable and meant no visitor could ever
 * create an account — the product shipped with no way to acquire a user.
 */
test('a signed-out visitor is sent to sign-in, not into someone else’s dashboard', async ({
  page,
}) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/sign-in/)
  await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible()
})

test('sign-in is reachable directly rather than redirecting away', async ({ page }) => {
  await page.goto('/sign-in')
  await expect(page).toHaveURL(/\/sign-in/)
  await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible()
})

test.describe('Auth + onboarding journey', () => {
  test('sign out → sign in → onboarding → coach', async ({ page }) => {
    // Starts from a signed-in user, which now has to be stated explicitly.
    await seedAssessed(page)
    await page.goto('/dashboard')

    await page.getByRole('button', { name: 'Account menu' }).click()
    await page.getByRole('menuitem', { name: 'Sign out' }).click()
    await expect(page).toHaveURL(/\/sign-in/)

    await page.getByRole('button', { name: /Continue with Google/i }).click()
    await expect(page).toHaveURL(/\/onboarding/)
    // The plans were "Resume + Cover Letter + Roadmap" when the roadmap
    // existed. They are now the two the product actually ships.
    await expect(page.getByRole('heading', { name: 'Just my CV' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'CV + cover letters' })).toBeVisible()

    await page.getByRole('button', { name: /Continue to your coach/i }).click()
    await expect(page).toHaveURL(/\/coach/)
    await expect(page.getByRole('heading', { name: 'Career assessment' })).toBeVisible()
  })
})
