/** Centralised route table. Never hardcode a path string at a call site. */
export const ROUTES = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  onboarding: '/onboarding',
  dashboard: '/dashboard',
  coach: '/coach',
  roadmap: '/roadmap',
  resume: '/resume',
  coverLetter: '/cover-letter',
  applications: '/applications',
  achievements: '/achievements',
  settings: '/settings',
  admin: '/admin',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]

export const DYNAMIC_ROUTES = {
  application: (id: string) => `/applications/${encodeURIComponent(id)}`,
  document: (id: string) => `/documents/${encodeURIComponent(id)}`,
  adminQuestionSet: (id: string) => `/admin/question-sets/${encodeURIComponent(id)}`,
} as const
