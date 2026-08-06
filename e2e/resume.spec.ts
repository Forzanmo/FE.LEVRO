import { expect, test } from './fixtures'

import { seedAssessed, seedOnboardedNoAssessment } from './support/journey'

test.describe('Resume editor', () => {
  // The generated CV is the assessment's output, so the editor only seeds it
  // for a user who has taken one.
  test.beforeEach(async ({ page }) => {
    await seedAssessed(page)
  })

  test('editing autosaves and updates the live preview', async ({ page }) => {
    await page.goto('/resume')

    const name = page.getByLabel('Full name')
    await expect(name).toHaveValue('Alex Rivera')

    await name.fill('Jordan Blake')
    await expect(page.getByText('Saved')).toBeVisible()
    // `#resume-sheet` belonged to the deleted resume-preview. The editor now
    // previews through the shared `CvTemplate`, which carries a stable hook.
    await expect(page.getByTestId('cv-sheet').getByText('Jordan Blake')).toBeVisible()
  })

  test('can add an experience role', async ({ page }) => {
    await page.goto('/resume')
    // Wait for hydration: RHF populates the seed value once the client is live.
    await expect(page.getByLabel('Full name')).toHaveValue('Alex Rivera')
    await page.getByRole('button', { name: 'Add role' }).click()
    await expect(page.getByText('Role 3')).toBeVisible()
  })
})

test('the legacy standalone editor is not exposed in primary navigation', async ({
  page,
}) => {
  await seedOnboardedNoAssessment(page)
  await page.goto('/dashboard')
  await expect(page.locator('aside').getByRole('link', { name: 'Edit CV' })).toHaveCount(0)
  await expect(page.locator('aside').getByRole('link', { name: 'Applications' })).toBeVisible()
})
