import type { Metadata } from 'next'
import Link from 'next/link'

import { StatusPage } from '@/components/shared/status-page'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = {
  title: 'Page not found',
}

/**
 * A dead URL used to render Next's stock "404: This page could not be found."
 * — unbranded, chromeless, and with no way back into the product. That is a bad
 * look anywhere; it is worse here, because routes the product has retired
 * (`/roadmap`, `/achievements`) are still live bookmarks and email links, so
 * this page is reached by users who did nothing wrong.
 */
export default function NotFound() {
  return (
    <StatusPage
      icon="search"
      tone="neutral"
      title="We couldn’t find that page"
      description="The link may be out of date, or the page may have moved as the product changed. Nothing of yours has been lost — your CV, documents and applications are all where you left them."
      actions={
        <>
          <Button asChild size="lg">
            <Link href={ROUTES.dashboard}>
              Go to my dashboard
              <Icon name="arrow-right" size="sm" />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={ROUTES.home}>Back to home</Link>
          </Button>
        </>
      }
    />
  )
}
