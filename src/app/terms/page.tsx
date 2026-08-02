import type { Metadata } from 'next'
import Link from 'next/link'

import { BrandBackdrop } from '@/components/shared/brand-backdrop'
import { SkipLink } from '@/components/shared/skip-link'
import { Logo } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Heading, Text } from '@/components/ui/typography'
import { ROUTES } from '@/lib/constants/routes'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Terms of Service',
}

/**
 * Placeholder route so the sign-in gate can link somewhere real.
 *
 * The sign-in screen previously rendered "Terms and Privacy Policy" as
 * unclickable plain text at the exact moment a user hands over their employment
 * history. Linking to a 404 would be worse, so this states plainly that the
 * document is not published yet rather than inventing legal terms.
 */
export default function TermsPage() {
  return (
    <div className="relative flex min-h-svh flex-col">
      <SkipLink />
      <BrandBackdrop />
      <header className="mx-auto flex h-16 w-full max-w-[var(--content-max-width)] items-center px-4 sm:px-6 lg:px-8">
        <Logo />
      </header>
      <main id="main-content" className="mx-auto w-full max-w-[var(--content-max-width)] flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <Heading level={1} size="display-sm">
          Terms of Service
        </Heading>
        <Text tone="muted" measure="prose" className="mt-4">
          Our full terms are being finalised and are not published yet. Until they are, we will not
          claim you have agreed to something you cannot read. If you need them before signing up,
          write to{' '}
          <a href={`mailto:${siteConfig.contactEmail}`} className="underline">
            {siteConfig.contactEmail}
          </a>{' '}
          and we will send the current draft.
        </Text>
        {/* Shared Button, same reasoning as the privacy page: a standalone
            navigational target has to clear the 24px touch floor. */}
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
