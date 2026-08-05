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

test('without an assessment the editor offers the coach instead of a stranger’s CV', async ({
  page,
}) => {
  // Signed in and onboarded, but the assessment has never been taken. That
  // has to be stated now that a first visit is signed out — otherwise this
  // lands on /sign-in and the pre-assessment design goes untested.
  await seedOnboardedNoAssessment(page)
  await page.goto('/resume')

  await expect(page.getByText('Alex Rivera')).toHaveCount(0)
  await expect(page.getByRole('link', { name: /Start my assessment/i })).toBeVisible()

  // The coach is the recommended path, not a gate.
  await page.getByRole('button', { name: /Start from a blank CV/i }).click()
  await expect(page.getByLabel('Full name')).toHaveValue('')
})
