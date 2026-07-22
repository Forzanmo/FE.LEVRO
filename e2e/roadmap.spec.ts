import { expect, test } from '@playwright/test'

test.describe('Roadmap quest tree', () => {
  test('completing an available quest updates progress', async ({ page }) => {
    await page.goto('/roadmap')

    await expect(page.getByText('3 of 10 quests complete')).toBeVisible()
    await page.getByRole('button', { name: 'Complete quest' }).click()
    await expect(page.getByText('4 of 10 quests complete')).toBeVisible()
  })

  test('a locked quest shows its prerequisites', async ({ page }) => {
    await page.goto('/roadmap')
    await page.getByRole('button', { name: /Land the offer/ }).click()
    await expect(page.getByText(/Unlocks after:/)).toBeVisible()
  })
})
