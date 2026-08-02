import { expect, test } from '@playwright/test'

/**
 * The landing page's small-screen behaviour.
 *
 * These are the failures that do not show up on a desktop run and do not show
 * up in a screenshot either: chrome that renders underneath a sticky bar,
 * content clipped by a section's own `overflow-hidden`, and a menu that traps
 * keyboard users because its trigger was hand-rolled.
 *
 * The project's only Playwright project is Desktop Chrome, so the viewport is
 * set per-test rather than by a device profile.
 */
test.describe('Marketing — mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('the menu opens above the sticky header and returns focus on Escape', async ({ page }) => {
    await page.goto('/')

    const trigger = page.getByRole('button', { name: 'Open menu' })
    await trigger.click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // The sheet used to render at a hardcoded z-50, below this project's
    // `--z-sticky` (1100), so the marketing header covered its title and close
    // button. Asserting on the title's visibility is asserting on the z-order.
    await expect(dialog.getByRole('heading', { name: 'Menu' })).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Close' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    // Radix can only restore focus to a trigger it owns. With a hand-rolled
    // onClick it dropped focus on <body> and sent the user back to the top of
    // the document.
    await expect(trigger).toBeFocused()
  })

  test('a menu link closes the sheet and moves to the section', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('dialog').getByRole('link', { name: 'How it works' }).click()

    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(page).toHaveURL(/#how-it-works$/)
  })

  test('nothing overflows the viewport at 320px', async ({ page }) => {
    // The hero grid's implicit `min-width: auto` let the panel's nowrap text
    // push the single-column track to 350px inside a 320px viewport. The
    // section's `overflow-hidden` meant no scrollbar appeared — the headline was
    // simply clipped off the right edge, silently, on the narrowest phones. A
    // scrollWidth check alone would not have caught it, so this measures the
    // headline's own box.
    await page.setViewportSize({ width: 320, height: 720 })
    await page.goto('/')

    const heading = page.getByRole('heading', { level: 1 })
    const box = await heading.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x + box!.width).toBeLessThanOrEqual(320)

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBe(0)
  })

  test('the deck progress bar exists only where there is a deck to be partway through', async ({
    page,
  }) => {
    /*
     * This shipped broken. The bar is hidden above `md` by CSS inside a
     * `@supports` block, and the first version relied on a `md:hidden` utility
     * class to do it — which lost, because Tailwind utilities live in
     * `@layer utilities` and unlayered CSS beats any layer at equal
     * specificity. The result was a 1176x2 rule slicing across every desktop
     * viewport, `transform: none`, reporting a scroll position of 100% for a
     * deck that is a static grid at that width.
     *
     * A cascade bug is invisible to typecheck, lint, axe and a contrast gate.
     * It needs a test that looks at the rendered box.
     */
    await page.goto('/')
    const bar = page.locator('.deck-progress')

    await page.setViewportSize({ width: 390, height: 844 })
    await expect(bar).toBeVisible()

    await page.setViewportSize({ width: 1280, height: 900 })
    await expect(bar).toBeHidden()
  })

  test('the how-it-works deck is reachable by keyboard', async ({ page }) => {
    // It is a horizontal scroller whose cards contain no links, so without an
    // explicit tabindex there is no way to reach steps 2 and 3 without a
    // pointer (axe: scrollable-region-focusable).
    await page.goto('/')
    const deck = page.getByRole('list', { name: /How it works, in three steps/i })
    await expect(deck).toBeVisible()
    await deck.focus()
    await expect(deck).toBeFocused()
  })
})
