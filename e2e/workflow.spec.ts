import { expect, test } from './fixtures'

test.describe('Application workspace', () => {
  test('shows the real production workflow stages', async ({ page }) => {
    await page.goto('/applications/a1')
    await expect(page.getByRole('heading', { name: 'Frontend Engineer' })).toBeVisible()
    await expect(page.getByText('1. Opportunity')).toBeVisible()
    await expect(page.getByText('2. CV extraction')).toBeVisible()
    await expect(page.getByText('Interview complete')).toBeVisible()
    await expect(page.getByRole('link', { name: /cv/i })).toBeVisible()
  })
})
