import type { Page } from '@playwright/test'

import { expect, test } from './fixtures'

import { seedAssessed } from './support/journey'

/**
 * Stacking order, asserted on real pixels.
 *
 * Both of these broke silently once. The shadcn primitives ship with a
 * hardcoded `z-50`, which happens to work while *everything* is z-50 and DOM
 * order decides; the moment the primitives moved onto the project's semantic
 * scale, the scale's own ordering became load-bearing — and it had `dropdown`
 * below both `sticky` and `modal`.
 *
 * Neither failure is visible to axe or to a contrast gate: the elements are
 * present, sized and correctly coloured. They are just behind something. So the
 * assertion has to be "which element owns this pixel", not "is it in the DOM".
 */
async function ownsItsOwnCentre(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel)
    if (!el) return { found: false as const }
    const r = el.getBoundingClientRect()
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
    return {
      found: true as const,
      owned: !!(top && (el === top || el.contains(top))),
      blockedBy: top ? `${top.tagName}.${String(top.className ?? '').slice(0, 60)}` : null,
    }
  }, selector)
}

test.describe('Stacking order', () => {
  test.beforeEach(async ({ page }) => {
    await seedAssessed(page)
  })

  test('a select opened inside a dialog renders above the dialog', async ({ page }) => {
    // The regression this exists for: `dropdown` (1000) sat below `modal`
    // (1400), so the listbox of the status Select in "Add application" drew
    // underneath the dialog's own scrim.
    await page.goto('/applications')
    await page.getByRole('button', { name: /Add application/i }).first().click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.getByRole('combobox').first().click()

    const listbox = page.getByRole('listbox')
    await expect(listbox).toBeVisible()

    const hit = await ownsItsOwnCentre(page, '[role=listbox]')
    expect(hit.found).toBe(true)
    expect(hit.owned, `listbox is occluded by ${hit.blockedBy}`).toBe(true)
  })

  test('a menu opened from the sticky header renders above it', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('button', { name: 'Change theme' }).click()

    const menu = page.getByRole('menu')
    await expect(menu).toBeVisible()

    const hit = await ownsItsOwnCentre(page, '[role=menu]')
    expect(hit.found).toBe(true)
    expect(hit.owned, `menu is occluded by ${hit.blockedBy}`).toBe(true)
  })

  test('the semantic scale keeps transient overlays above modal and sticky', async ({ page }) => {
    // Guards the ordering itself, so a future edit to the scale fails here
    // rather than in whichever component happens to expose it.
    await page.goto('/dashboard')
    const z = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement)
      const v = (n: string) => Number(cs.getPropertyValue(`--z-${n}`).trim())
      return {
        sticky: v('sticky'),
        overlay: v('overlay'),
        modal: v('modal'),
        dropdown: v('dropdown'),
        popover: v('popover'),
        toast: v('toast'),
        tooltip: v('tooltip'),
      }
    })
    expect(z.overlay).toBeLessThan(z.modal)
    expect(z.modal).toBeGreaterThan(z.sticky)
    expect(z.dropdown).toBeGreaterThan(z.sticky)
    expect(z.dropdown).toBeGreaterThan(z.modal)
    expect(z.popover).toBeGreaterThan(z.dropdown)
    expect(z.toast).toBeGreaterThan(z.popover)
    expect(z.tooltip).toBeGreaterThan(z.toast)
  })
})
