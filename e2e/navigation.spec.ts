import { expect, test } from './fixtures'

import { seedAssessed } from './support/journey'

test.describe('Navigation + theme', () => {
  test.beforeEach(async ({ page }) => {
    await seedAssessed(page)
  })

  test('sidebar navigates between app routes', async ({ page }) => {
    await page.goto('/dashboard')

    await page.locator('aside').getByRole('link', { name: 'Applications' }).click()
    await expect(page).toHaveURL(/\/applications/)

    await page.locator('aside').getByRole('link', { name: 'Documents' }).click()
    await expect(page).toHaveURL(/\/documents/)
  })

  test('theme can be switched to dark', async ({ page }) => {
    await page.goto('/dashboard')

    await page.getByRole('button', { name: 'Change theme' }).click()
    await page.getByRole('menuitem', { name: 'Dark' }).click()

    await expect(page.locator('html')).toHaveClass(/dark/)
  })
})
