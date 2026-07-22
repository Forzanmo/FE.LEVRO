import { expect, test } from '@playwright/test'

test.describe('Navigation + theme', () => {
  test('sidebar navigates between app routes', async ({ page }) => {
    await page.goto('/dashboard')

    await page.locator('aside').getByRole('link', { name: 'Resume' }).click()
    await expect(page).toHaveURL(/\/resume/)

    await page.locator('aside').getByRole('link', { name: 'Applications' }).click()
    await expect(page).toHaveURL(/\/applications/)
  })

  test('theme can be switched to dark', async ({ page }) => {
    await page.goto('/dashboard')

    await page.getByRole('button', { name: 'Change theme' }).click()
    await page.getByRole('menuitem', { name: 'Dark' }).click()

    await expect(page.locator('html')).toHaveClass(/dark/)
  })
})
