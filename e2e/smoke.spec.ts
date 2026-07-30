import { expect, test } from '@playwright/test'

import { seedAssessed } from './support/journey'

test.describe('Levvro smoke', () => {
  test('landing renders the hero and primary CTA', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'says less about you than you think',
    )
    await expect(
      page.getByRole('link', { name: /Start Your Career Journey/i }).first(),
    ).toBeVisible()
  })

  test('dashboard leads with the skills read-out', async ({ page }) => {
    // Was "dashboard renders the career readiness score". The score was removed
    // (PRODUCT.md, "Planned"); the skills-coverage card answers the same
    // question with evidence attached, and is what the dashboard leads on now.
    await seedAssessed(page)
    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: /skills/i }).first()).toBeVisible()
  })

  test('a brand-new visitor is offered the assessment, not someone else’s history', async ({
    page,
  }) => {
    // The regression this guards is the P0 that shipped twice: every history
    // service used to answer with fixtures regardless of whether the user had
    // done anything.
    await page.goto('/dashboard')
    await expect(page.getByRole('link', { name: /Start my assessment/i })).toBeVisible()
    await expect(page.getByText(/day streak/i)).toHaveCount(0)
  })

  test('AI coach renders the assessment', async ({ page }) => {
    await page.goto('/coach')
    await expect(page.getByRole('heading', { name: 'Career assessment' })).toBeVisible()
    await expect(page.getByText('Levvro coach').first()).toBeVisible()
  })

  test('applications table renders rows and controls', async ({ page }) => {
    await seedAssessed(page)
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
