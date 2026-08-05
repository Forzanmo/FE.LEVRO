import { mkdirSync } from 'node:fs'
import path from 'node:path'

import { expect, test } from '@playwright/test'

import { installApi } from '../e2e/fixtures'

const assets = path.resolve(process.cwd(), '../docs/user-manual/assets')

async function capture(page: Parameters<typeof installApi>[0], name: string) {
  await page.waitForTimeout(350)
  await page.screenshot({ path: path.join(assets, name), fullPage: false })
}

test('capture client user manual screens', async ({ page }) => {
  mkdirSync(assets, { recursive: true })
  await installApi(page)

  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await capture(page, '01-landing.png')

  await page.goto('/dashboard')
  await expect(page.getByText('Career Readiness Score')).toBeVisible()
  await capture(page, '02-dashboard.png')

  await page.goto('/coach')
  await expect(page.getByText('Where are you in your career right now?')).toBeVisible()
  await capture(page, '03-coach.png')

  await page.goto('/applications')
  await expect(page.getByText('Vercel').first()).toBeVisible()
  await capture(page, '04-applications.png')

  await page.goto('/applications/a1')
  await expect(page.getByText('1. Opportunity')).toBeVisible()
  await capture(page, '05-application-workspace.png')

  await page.goto('/documents/doc-1')
  await expect(page.getByRole('heading', { name: 'Alex Rivera — Frontend Engineer' })).toBeVisible()
  await capture(page, '06-document-editor.png')

  await page.goto('/resume')
  await expect(page.getByLabel('Full name')).toHaveValue('Alex Rivera')
  await capture(page, '06-resume.png')

  await page.goto('/cover-letter')
  await page.getByLabel('Company').fill('Vercel')
  await page.getByLabel('Role').fill('Frontend Engineer')
  await page.getByLabel(/Key points/i).fill('Built accessible product interfaces')
  await page.getByRole('button', { name: 'Generate cover letter' }).click()
  await expect(page.getByText('Dear Hiring Manager,')).toBeVisible()
  await capture(page, '07-cover-letter.png')

  await page.goto('/roadmap')
  await expect(page.getByText('3 of 10 quests complete')).toBeVisible()
  await capture(page, '08-roadmap.png')

  await page.goto('/achievements')
  await expect(page.getByText('Quest Master')).toBeVisible()
  await capture(page, '09-achievements.png')

  await page.goto('/settings')
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
  await capture(page, '10-settings.png')

  await page.goto('/admin')
  await expect(page.getByRole('heading', { name: 'Admin panel' })).toBeVisible()
  await capture(page, '11-admin.png')

  await page.goto('/admin/question-sets/version-1')
  await expect(page.locator('input[value="What role are you targeting?"]')).toBeVisible()
  await capture(page, '12-question-bank.png')

  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Account menu' }).click()
  await page.getByRole('menuitem', { name: 'Sign out' }).click()
  await expect(page).toHaveURL(/\/sign-in/)
  await capture(page, '13-sign-in.png')
})
