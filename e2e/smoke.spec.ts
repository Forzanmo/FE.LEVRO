import { expect, test } from '@playwright/test'

import { seedAssessed, seedOnboardedNoAssessment } from './support/journey'

test.describe('Levvro smoke', () => {
  test('landing renders the hero and primary CTA', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'what your CV proves',
    )
    await expect(page.getByRole('link', { name: /See what mine proves/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Start your assessment/i }).first()).toBeVisible()
  })

  test('the hero product panel states a verdict, its evidence, and that it is an example', async ({
    page,
  }) => {
    // The panel is the page's whole argument — a verdict is worthless here
    // without the line of the CV that earned it, and the counts have to
    // reconcile with the meter beside them. If a redesign drops the reasoning
    // line, the landing page is asserting rather than evidencing, which is the
    // one thing this product exists to argue against.
    await page.goto('/')
    await expect(page.getByText('Skills assessment')).toBeVisible()
    await expect(page.getByText('Evidenced').first()).toBeVisible()
    await expect(page.getByText(/Owned the weekly performance report for six campaigns/)).toBeVisible()
    await expect(page.getByRole('img', { name: '7 of 11 skills evidenced' })).toBeVisible()

    // Labelled as an example. It is a fabricated assessment of a fictional
    // person on the page that argues evidence over assertion; unlabelled, it is
    // the page contradicting itself.
    await expect(page.getByText('Example')).toBeVisible()

    // NOT a software engineer. The eyebrow beside this panel says "For juniors
    // and career shifters"; when the worked example listed React and TypeScript
    // it told most of that audience the product was not for them.
    await expect(page.getByText(/Target role · Marketing Coordinator/)).toBeVisible()
    await expect(page.getByText('TypeScript')).toHaveCount(0)
  })

  test('dashboard leads with the skills read-out', async ({ page }) => {
    // Was "dashboard renders the career readiness score". The score was removed
    // (PRODUCT.md, "Planned"); the skills-coverage card answers the same
    // question with evidence attached, and is what the dashboard leads on now.
    await seedAssessed(page)
    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: /skills/i }).first()).toBeVisible()
  })

  test('a brand-new visitor is offered the assessment, not someone else’s history', async ({
    page,
  }) => {
    // The regression this guards is the P0 that shipped twice: every history
    // service used to answer with fixtures regardless of whether the user had
    // done anything.
    await seedOnboardedNoAssessment(page)
    await page.goto('/dashboard')
    await expect(page.getByRole('link', { name: /Start my assessment/i })).toBeVisible()
    await expect(page.getByText(/day streak/i)).toHaveCount(0)
  })

  test('AI coach renders the assessment', async ({ page }) => {
    await seedAssessed(page)
    await page.goto('/coach')
    await expect(page.getByRole('heading', { name: 'Career assessment' })).toBeVisible()
    await expect(page.getByText('Levvro coach').first()).toBeVisible()
  })

  test('applications table renders rows and controls', async ({ page }) => {
    await seedAssessed(page)
    await page.goto('/applications')
    await expect(page.getByText('Vercel').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add application' })).toBeVisible()
  })

  test('signing out leads to the sign-in screen', async ({ page }) => {
    await seedAssessed(page)
    await page.goto('/dashboard')
    await page.getByRole('button', { name: 'Account menu' }).click()
    await page.getByRole('menuitem', { name: 'Sign out' }).click()
    await expect(page).toHaveURL(/\/sign-in/)
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible()
  })
})
