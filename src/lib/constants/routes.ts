/**
 * Centralised route table. Never hardcode a path string at a call site.
 *
 * Two entries are deliberate stubs for planned features (see PRODUCT.md,
 * "Planned"): `signUp` has no page yet, and the roadmap will reappear here when
 * it is built. Kept rather than deleted so the eventual route lands in one
 * place — but nothing may link to a stub, because a nav item pointing at a 404
 * is worse than a missing feature.
 */
export const ROUTES = {
  home: '/',
  signIn: '/sign-in',
  /** STUB — no page. Google sign-in currently covers registration too. */
  signUp: '/sign-up',
  onboarding: '/onboarding',
  dashboard: '/dashboard',
  coach: '/coach',
  /** Library of every CV and cover letter. */
  documents: '/documents',
  resume: '/resume',
  coverLetter: '/cover-letter',
  applications: '/applications',
  admin: '/admin',
  /** STUB — removed with the roadmap; rebuild the two together (PRODUCT.md). */
  achievements: '/achievements',
  settings: '/settings',
  terms: '/terms',
  privacy: '/privacy',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]

export const DYNAMIC_ROUTES = {
  application: (id: string) => `${ROUTES.applications}/${id}`,
  document: (id: string) => `${ROUTES.documents}/${id}`,
  adminQuestionSet: (id: string) => `${ROUTES.admin}/question-sets/${id}`,
} as const
