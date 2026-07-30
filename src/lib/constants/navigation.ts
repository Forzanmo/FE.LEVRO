import type { IconName } from '@/components/ui/icon'

import { ROUTES } from './routes'

export interface NavItem {
  label: string
  href: string
  icon: IconName
}

/** Full sidebar navigation (spec §4). */
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: 'Dashboard', href: ROUTES.dashboard, icon: 'dashboard' },
  { label: 'AI Coach', href: ROUTES.coach, icon: 'coach' },
  { label: 'Documents', href: ROUTES.documents, icon: 'resume' },
  // "Edit CV", not "Resume": the product calls this artifact a CV everywhere
  // else, and two nouns for one object is the mental-model drift that makes an
  // app feel like several apps.
  { label: 'Edit CV', href: ROUTES.resume, icon: 'edit' },
  { label: 'Cover Letter', href: ROUTES.coverLetter, icon: 'cover-letter' },
  { label: 'Applications', href: ROUTES.applications, icon: 'applications' },
  // Achievements removed with the roadmap that fed it (PRODUCT.md, "Planned").
  // A badge wall with no progression behind it is the gamification the product's
  // anti-references rule out, and it was the one screen stacking two of the
  // absolute bans — a hero-metric row above an identical-card grid.
]

export const SECONDARY_NAV: readonly NavItem[] = [
  { label: 'Settings', href: ROUTES.settings, icon: 'settings' },
]

/** Mobile bottom navigation — a focused five-item subset. */
export const MOBILE_NAV: readonly NavItem[] = [
  { label: 'Dashboard', href: ROUTES.dashboard, icon: 'dashboard' },
  { label: 'Coach', href: ROUTES.coach, icon: 'coach' },
  { label: 'Docs', href: ROUTES.documents, icon: 'resume' },
  // "Edit CV", not "Resume": the product calls this artifact a CV everywhere
  // else, and two nouns for one object is the mental-model drift that makes an
  // app feel like several apps.
  { label: 'Edit CV', href: ROUTES.resume, icon: 'edit' },
  { label: 'Apps', href: ROUTES.applications, icon: 'applications' },
]
