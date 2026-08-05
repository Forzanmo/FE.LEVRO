import { expect, test } from './fixtures'

/**
 * The roadmap is planned, not built (PRODUCT.md, "Planned"). `/roadmap` and its
 * quest tree were removed; these tests describe the behaviour the feature is
 * expected to have when it returns.
 *
 * Skipped rather than deleted, on purpose. Deleting them loses the only written
 * record of what the feature did; leaving them running fails the suite forever,
 * which trains everyone to ignore a red run. Unskip alongside the rebuild.
 */
test.describe.skip('Roadmap quest tree (planned — feature not built)', () => {
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

/** The one thing that must stay true while the feature is away. */
test('a retired route renders the branded not-found page, not a stock 404', async ({ page }) => {
  await page.goto('/roadmap')

  await expect(page.getByRole('heading', { name: /couldn’t find that page/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /go to my dashboard/i })).toBeVisible()
})
