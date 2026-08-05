import { expect, test } from './fixtures'

test.describe('Resume editor', () => {
  test('editing autosaves and updates the live preview', async ({ page }) => {
    await page.goto('/resume')

    const name = page.getByLabel('Full name')
    await expect(name).toHaveValue('Alex Rivera')

    await name.fill('Jordan Blake')
    await expect(page.getByText('Saved')).toBeVisible()
    await expect(page.locator('#resume-sheet').getByText('Jordan Blake')).toBeVisible()
  })

  test('can add an experience role', async ({ page }) => {
    await page.goto('/resume')
    // Wait for hydration: RHF populates the seed value once the client is live.
    await expect(page.getByLabel('Full name')).toHaveValue('Alex Rivera')
    await page.getByRole('button', { name: 'Add role' }).click()
    await expect(page.getByText('Role 3')).toBeVisible()
  })
})
