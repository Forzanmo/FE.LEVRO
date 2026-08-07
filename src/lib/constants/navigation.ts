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
  { label: 'AI workspace', href: ROUTES.coach, icon: 'coach' },
  { label: 'Documents', href: ROUTES.documents, icon: 'resume' },
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
  { label: 'Workspace', href: ROUTES.coach, icon: 'coach' },
  { label: 'Docs', href: ROUTES.documents, icon: 'resume' },
]
