import { expect, test } from './fixtures'

test.describe('Applications table', () => {
  test('search filters the rows', async ({ page }) => {
    await page.goto('/applications')
    const table = page.locator('table')

    await expect(table.getByText('Vercel')).toBeVisible()
    await page.getByRole('textbox', { name: 'Search applications' }).fill('Stripe')
    await expect(table.getByText('Stripe')).toBeVisible()
    await expect(table.getByText('Vercel')).toHaveCount(0)
  })

  test('status filter narrows the rows', async ({ page }) => {
    await page.goto('/applications')
    const table = page.locator('table')

    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: 'Offer' }).click()

    await expect(table.getByText('Notion')).toBeVisible()
    await expect(table.getByText('Vercel')).toHaveCount(0)
  })

  test('can add an application', async ({ page }) => {
    await page.goto('/applications')

    await page.getByRole('button', { name: 'Add application' }).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByLabel('Company').fill('Aperture')
    await dialog.getByLabel('Role').fill('Frontend Engineer')
    await dialog.getByRole('button', { name: 'Add application' }).click()

    await expect(page.locator('table').getByText('Aperture')).toBeVisible()
  })

  test('delete shows an undo toast that restores the row', async ({ page }) => {
    await page.goto('/applications')
    const table = page.locator('table')

    await expect(table.getByText('Vercel')).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: 'Delete Vercel application' }).click()
    await expect(table.getByText('Vercel')).toHaveCount(0)

    await page.getByRole('button', { name: 'Undo' }).click()
    await expect(table.getByText('Vercel')).toBeVisible()
  })
})
