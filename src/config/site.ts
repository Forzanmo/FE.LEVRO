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
  ogImage: '/og.png',
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
