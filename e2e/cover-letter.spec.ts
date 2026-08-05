import { expect, test } from './fixtures'

import { seedAssessed } from './support/journey'

test.describe('Cover Letter generator', () => {
  test('generates a letter from the form', async ({ page }) => {
    // The generator is gated on having taken the assessment: it argues from the
    // evidence the coach collected, so there is nothing honest to write without it.
    await seedAssessed(page)
    await page.goto('/cover-letter')

    await expect(page.getByText('Your letter will appear here')).toBeVisible({ timeout: 15_000 })

    await page.getByLabel('Company').fill('Vercel')
    await page.getByLabel('Role').fill('Frontend Engineer')
    await page.getByRole('button', { name: 'Generate cover letter' }).click()

    await expect(page.getByText('Dear Hiring Manager,')).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('button', { name: 'Download PDF' })).toBeVisible()
  })
})
