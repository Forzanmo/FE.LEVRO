/**
 * Global, environment-agnostic product configuration.
 * Imported by metadata, marketing pages, and layout chrome.
 */
export const siteConfig = {
  name: 'Levvro',
  title: 'Levvro — AI Career Intelligence',
  description:
    'Transform career uncertainty into a measurable roadmap toward getting hired. Assessment, coaching, and AI-generated career assets for juniors and career shifters.',
  tagline: 'Never waste your time.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://levvro.app',
  ogImage: '/og.png',
  creator: 'Levvro',
  keywords: [
    'AI career coach',
    'resume generator',
    'career roadmap',
    'cover letter generator',
    'career readiness score',
    'job search',
  ],
  links: {
    twitter: 'https://twitter.com/levvro',
    github: 'https://github.com/levvro',
  },
} as const

export type SiteConfig = typeof siteConfig
