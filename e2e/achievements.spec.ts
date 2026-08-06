import { expect, test } from './fixtures'

test.describe('Achievements (outside the MVP)', () => {
  test('the retired route uses the branded not-found page', async ({ page }) => {
    await page.goto('/achievements')
    await expect(page.getByRole('heading', { name: /couldn’t find that page/i })).toBeVisible()
  })
})
