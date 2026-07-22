import { expect, test } from '@playwright/test'

test.describe('AI Coach', () => {
  test('answering advances the assessment; Back returns', async ({ page }) => {
    await page.goto('/coach')

    await expect(page.getByText('Where are you in your career right now?')).toBeVisible()
    await expect(page.getByText('1/8')).toBeVisible()

    await page.getByText(/Junior \(0/).click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.getByText('What role are you aiming for?')).toBeVisible()
    await expect(page.getByText('2/8')).toBeVisible()

    await page.getByRole('button', { name: 'Back' }).click()
    await expect(page.getByText('1/8')).toBeVisible()
  })

  test('reasoning disclosure can be opened', async ({ page }) => {
    await page.goto('/coach')
    await page.getByRole('button', { name: /Why I.m asking/ }).first().click()
    await expect(page.getByText(/calibrates everything else/)).toBeVisible()
  })
})
