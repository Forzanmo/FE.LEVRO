import { expect, test } from './fixtures'

test.describe('Admin panel', () => {
  test('shows operations and opens the question editor', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByRole('heading', { name: 'Admin panel' })).toBeVisible()
    await expect(page.getByText('gemini · gemini-3.6-flash')).toBeVisible()

    await page.getByRole('link', { name: /Default guided flow/ }).click()
    await expect(page).toHaveURL(/\/admin\/question-sets\/version-1/, { timeout: 15_000 })
    await expect(page.locator('input[value="What role are you targeting?"]')).toBeVisible()
  })
})
