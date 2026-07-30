import { expect, test } from '@playwright/test'

test.describe('Navigation + theme', () => {
  test('sidebar navigates between app routes', async ({ page }) => {
    await page.goto('/dashboard')

    // "Edit CV", not "Resume": `navigation.ts` renamed the artifact on purpose,
    // so this assertion is now also a guard against the noun drifting back.
    await page.locator('aside').getByRole('link', { name: 'Edit CV' }).click()
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
