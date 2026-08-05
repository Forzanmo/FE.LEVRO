'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import { StatusPage } from '@/components/shared/status-page'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { ROUTES } from '@/lib/constants/routes'

/**
 * Route-level error boundary. Without one, any thrown render error took the
 * whole app down to a blank page in production.
 *
 * The copy leads with what is true and reassuring — the user's work is in
 * localStorage and survives this — because the audience is anxious job-seekers
 * and a crash on a CV editor reads as "I lost my CV". `digest` is shown as a
 * reference rather than a stack trace: useful to quote to support, meaningless
 * to leak.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Real reporting hooks in here; console keeps it visible in development.
    console.error(error)
  }, [error])

  return (
    <StatusPage
      icon="warning"
      title="Something broke on our side"
      description="This isn’t you. Your CV, documents and applications are saved and unaffected — trying again usually clears it."
      actions={
        <>
          <Button size="lg" onClick={reset} leftIcon={<Icon name="refresh" size="sm" />}>
            Try again
          </Button>
          <Button asChild variant="ghost">
            <Link href={ROUTES.dashboard}>Go to my dashboard</Link>
          </Button>
        </>
      }
      footnote={error.digest ? <>Reference: {error.digest}</> : null}
    />
  )
}
