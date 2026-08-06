import { expect, test } from './fixtures'

import { seedAssessed } from './support/journey'

test.describe('AI Coach', () => {
  test.beforeEach(async ({ page }) => {
    await seedAssessed(page)
  })

  test('answering advances the assessment; Back returns', async ({ page }) => {
    await page.goto('/coach')

    // By role, not by text: the current question renders as a visible <h2> AND
    // as the ChoiceGroup's sr-only <legend> (so the radio set is announced with
    // its question attached), so `getByText` matches two nodes and trips
    // strict mode. The duplication is deliberate; the selector was wrong.
    await expect(
      page.getByRole('heading', { name: 'Where are you in your career right now?' }),
    ).toBeVisible()
    await expect(
      page.getByRole('progressbar', { name: 'Assessment progress' }).getByText('1/8'),
    ).toBeVisible()

    await page.getByText(/Junior \(0/).click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.getByRole('heading', { name: 'What role are you aiming for?' })).toBeVisible()
    await expect(
      page.getByRole('progressbar', { name: 'Assessment progress' }).getByText('2/8'),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Back' }).click()
    await expect(
      page.getByRole('progressbar', { name: 'Assessment progress' }).getByText('1/8'),
    ).toBeVisible()
  })

  test('reasoning disclosure can be opened', async ({ page }) => {
    await page.goto('/coach')
    await page.getByRole('button', { name: /Why I.m asking/ }).first().click()
    await expect(page.getByText(/calibrates everything else/)).toBeVisible()
  })
})
