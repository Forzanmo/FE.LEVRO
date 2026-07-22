import { expect, test } from '@playwright/test'

test.describe('Auth + onboarding journey', () => {
  test('sign out → sign in → onboarding → coach', async ({ page }) => {
    await page.goto('/dashboard')

    await page.getByRole('button', { name: 'Account menu' }).click()
    await page.getByRole('menuitem', { name: 'Sign out' }).click()
    await expect(page).toHaveURL(/\/sign-in/)

    await page.getByRole('button', { name: /Continue with Google/i }).click()
    await expect(page).toHaveURL(/\/onboarding/)
    await expect(
      page.getByRole('heading', { name: /Resume \+ Cover Letter \+ Roadmap/ }),
    ).toBeVisible()

    await page.getByRole('button', { name: /Continue to your coach/i }).click()
    await expect(page).toHaveURL(/\/coach/)
    await expect(page.getByRole('heading', { name: 'Career assessment' })).toBeVisible()
  })
})
