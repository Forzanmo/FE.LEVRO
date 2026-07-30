import type { Metadata } from 'next'
import Link from 'next/link'

import { AuroraBackdrop } from '@/components/shared/aurora-backdrop'
import { Logo } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Heading, Text } from '@/components/ui/typography'
import { ROUTES } from '@/lib/constants/routes'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

/**
 * Placeholder route so the sign-in gate can link somewhere real.
 *
 * See the note on the terms page: this states plainly that the full policy is
 * not published yet rather than inventing one. The two factual statements below
 * describe what the app actually does today (browser-local storage, no
 * third-party sharing) and must be kept true as the backend lands.
 */
export default function PrivacyPage() {
  return (
    <div className="relative flex min-h-svh flex-col">
      <AuroraBackdrop />
      <header className="mx-auto flex h-16 w-full max-w-[var(--content-max-width)] items-center px-4 sm:px-6 lg:px-8">
        <Logo />
      </header>
      <main className="mx-auto w-full max-w-[var(--content-max-width)] flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <Heading level={1} size="display-sm">
          Privacy Policy
        </Heading>
        <Text tone="muted" measure="prose" className="mt-4">
          Our full policy is being finalised and is not published yet. What is true of the product
          today: your assessment answers are stored in your own browser so you can leave and come
          back without losing your progress, and they are not sold or shared with third parties.
        </Text>
        <Text tone="muted" measure="prose" className="mt-4">
          If you want the current draft or want your data removed, write to{' '}
          <a href={`mailto:${siteConfig.contactEmail}`} className="underline">
            {siteConfig.contactEmail}
          </a>
          .
        </Text>
        {/* A Button, not a bare link: this is a standalone navigational target,
            so SC 2.5.8's inline-in-a-sentence exception does not apply and it has
            to clear the 24px floor. Using the shared component means it inherits
            the system's 36px height and focus ring rather than inventing both. */}
        <Button asChild variant="ghost" size="sm" className="mt-8 -ml-3">
          <Link href={ROUTES.home}>
            <Icon name="arrow-left" size="sm" />
            Back to home
          </Link>
        </Button>
      </main>
    </div>
  )
}
