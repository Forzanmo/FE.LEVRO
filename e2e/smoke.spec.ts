import { expect, test } from '@playwright/test'

test.describe('Levvro smoke', () => {
  test('landing renders the hero and primary CTA', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('roadmap to getting hired')
    await expect(
      page.getByRole('link', { name: /Start Your Career Journey/i }).first(),
    ).toBeVisible()
  })

  test('dashboard renders the career readiness score', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByText('Career Readiness Score')).toBeVisible()
    await expect(page.getByRole('meter', { name: /career readiness score/i })).toBeVisible()
  })

  test('AI coach renders the assessment', async ({ page }) => {
    await page.goto('/coach')
    await expect(page.getByRole('heading', { name: 'Career assessment' })).toBeVisible()
    await expect(page.getByText('Levvro coach').first()).toBeVisible()
  })

  test('applications table renders rows and controls', async ({ page }) => {
    await page.goto('/applications')
    await expect(page.getByText('Vercel').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add application' })).toBeVisible()
  })

  test('signing out leads to the sign-in screen', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('button', { name: 'Account menu' }).click()
    await page.getByRole('menuitem', { name: 'Sign out' }).click()
    await expect(page).toHaveURL(/\/sign-in/)
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible()
  })
})
