import { expect, test } from './fixtures'

test('career profile exposes every reusable PRD section', async ({ page }) => {
  await page.goto('/settings')

  for (const label of [
    'Full name',
    'Phone',
    'Location',
    'Education',
    'Experience',
    'Projects',
    'Skills',
    'Certifications',
    'Activities',
    'Languages',
    'Links',
  ]) {
    await expect(page.getByLabel(label, { exact: true })).toBeVisible()
  }

  await page.getByLabel('Phone').fill('+20 100 000 0000')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByText('Profile saved')).toBeVisible()
})

test('generated application documents open in the production editor', async ({ page }) => {
  await page.goto('/documents')
  await page.getByRole('link', { name: /CV — Frontend Engineer/i }).first().click()

  await expect(page).toHaveURL(/\/generated-documents\/doc-1/)
  await expect(page.getByRole('heading', { name: 'Live preview' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Regenerate section' }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Export PDF' })).toBeVisible()
})

test('account deletion requires password confirmation', async ({ page }) => {
  await page.goto('/settings')
  await page.getByRole('button', { name: 'Delete account' }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText('This cannot be undone.')).toBeVisible()
  await dialog.getByLabel('Password').fill('correct-horse-battery')
  await dialog.getByRole('button', { name: 'Delete permanently' }).click()
  await expect(page).toHaveURL(/\/sign-in$/)
})
