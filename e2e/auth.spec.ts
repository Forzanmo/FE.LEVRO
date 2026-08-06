import { expect, test } from './fixtures'

import { seedAssessed } from './support/journey'

/**
 * A first visit is signed out. These are the regression tests for that: the app
 * used to seed an authenticated, onboarded user on first paint, which made
 * `/sign-in` and `/onboarding` unreachable and meant no visitor could ever
 * create an account — the product shipped with no way to acquire a user.
 */
test.describe('Signed-out access', () => {
  test.use({ signedIn: false })

  test('a signed-out visitor is sent to sign-in, not into someone else’s dashboard', async ({
    page,
  }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/sign-in/)
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
  })

  test('password reset request and confirmation are reachable', async ({ page }) => {
    await page.goto('/forgot-password')
    await page.getByLabel('Email').fill('alex@example.com')
    await page.getByRole('button', { name: 'Send reset link' }).click()
    await expect(page.getByText('Check your inbox')).toBeVisible()

    await page.goto('/reset-password?token=e2e-reset-token')
    await page.getByLabel('New password', { exact: true }).fill('correct-horse-battery')
    await page.getByLabel('Confirm new password').fill('correct-horse-battery')
    await page.getByRole('button', { name: 'Update password' }).click()
    await expect(page).toHaveURL(/\/sign-in\?reset=complete/)
  })
})

test.describe('Auth + onboarding journey', () => {
  test('sign out → sign in → onboarding → applications', async ({ page }) => {
    // Starts from a signed-in user, which now has to be stated explicitly.
    await seedAssessed(page)
    await page.goto('/dashboard')

    await page.getByRole('button', { name: 'Account menu' }).click()
    await page.getByRole('menuitem', { name: 'Sign out' }).click()
    await expect(page).toHaveURL(/\/sign-in/)

    await page.getByLabel('Email').fill('alex@example.com')
    await page.getByLabel('Password').fill('correct-horse-battery')
    await page.getByRole('button', { name: 'Sign in', exact: true }).click()
    await expect(page).toHaveURL(/\/onboarding/)
    // The plans were "Resume + Cover Letter + Roadmap" when the roadmap
    // existed. They are now the two the product actually ships.
    await expect(page.getByRole('heading', { name: 'Just my CV' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'CV + cover letters' })).toBeVisible()

    await page.getByRole('button', { name: /Start your first application/i }).click()
    await expect(page).toHaveURL(/\/applications/)
    await expect(page.getByRole('heading', { name: 'Applications' })).toBeVisible()
  })
})
