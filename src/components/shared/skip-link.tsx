/**
 * Bypass-blocks link (WCAG 2.4.1, Level A): the first focusable element on the
 * page jumps a keyboard or screen-reader user past the repeated header straight
 * to content.
 *
 * Extracted from `AppShell`, which was the only place that had one. The
 * marketing pages, the auth pages and the status pages each repeat a header on
 * every route and each made a keyboard user tab through it — six stops on the
 * landing page before the first word of content. A bypass mechanism that exists
 * only on the authenticated half of a product is not a bypass mechanism.
 *
 * Pairs with an `id="main-content"` on the page's `<main>`.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[var(--z-toast)] focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg"
    >
      Skip to content
    </a>
  )
}
