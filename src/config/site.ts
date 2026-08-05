/**
 * Global, environment-agnostic product configuration.
 * Imported by metadata, marketing pages, and layout chrome.
 */
export const siteConfig = {
  name: 'Levvro',
  title: 'Levvro — AI Career Intelligence',
  description:
    'See what your CV actually proves — and fix what it doesn’t. AI coaching that maps your skills to the role you want, then writes the CV and cover letter that show it.',
  tagline: 'Never waste your time.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://levvro.app',
  /*
   * No `ogImage` here. It used to point at `/og.png`, a file that was never
   * created — and nothing read the field anyway, so the only thing it did was
   * make the social card look handled while `twitter:card` advertised
   * `summary_large_image` with no image behind it. The card is now
   * `app/opengraph-image.png`, discovered by Next's file convention, which
   * emits the URL and the dimensions and cannot silently point at nothing.
   * Regenerate it with `npm run brand-assets`.
   */
  creator: 'Levvro',
  /** Single source for the public contact address (footer, legal pages). */
  contactEmail: 'hello@levvro.app',
  keywords: [
    'AI career coach',
    'resume generator',
    'ATS resume template',
    'cover letter generator',
    'skills gap analysis',
    'job search',
  ],
  links: {
    twitter: 'https://twitter.com/levvro',
    github: 'https://github.com/levvro',
  },
} as const

export type SiteConfig = typeof siteConfig
