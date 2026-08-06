/**
 * Centralised route table. Never hardcode a path string at a call site.
 *
 * The sign-up form is intentionally part of the email/password sign-in screen;
 * there is no separate sign-up route or social-auth route at this time.
 */
export const ROUTES = {
  home: '/',
  signIn: '/sign-in',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  /** Reserved for a future dedicated sign-up page. */
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
  generatedDocument: (id: string) => `/generated-documents/${id}`,
  adminQuestionSet: (id: string) => `${ROUTES.admin}/question-sets/${id}`,
} as const
