import { expect, test } from './fixtures'

test.describe('Auth + onboarding journey', () => {
  test('sign out → sign in → onboarding → coach', async ({ page }) => {
    await page.goto('/dashboard')

    await page.getByRole('button', { name: 'Account menu' }).click()
    await page.getByRole('menuitem', { name: 'Sign out' }).click()
    await expect(page).toHaveURL(/\/sign-in/, { timeout: 15_000 })

    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Password').fill('correct-horse-battery')
    await page.getByRole('button', { name: 'Sign in', exact: true }).last().click()
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 15_000 })
    await expect(
      page.getByRole('heading', { name: /Resume \+ Cover Letter \+ Roadmap/ }),
    ).toBeVisible()

    await page.getByRole('button', { name: /Continue to your coach/i }).click()
    await expect(page).toHaveURL(/\/coach/, { timeout: 15_000 })
    await expect(page.getByRole('heading', { name: 'Career assessment' })).toBeVisible()
  })
})
