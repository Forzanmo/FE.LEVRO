import { expect, test } from './fixtures'

test.describe('Achievements', () => {
  test('renders progress derived by the backend', async ({ page }) => {
    await page.goto('/achievements')

    await expect(page.getByText('In the Arena')).toBeVisible()
    await expect(page.getByText('Quest Master')).toBeVisible()
    await expect(page.getByText('1/2')).toBeVisible()
  })
})
