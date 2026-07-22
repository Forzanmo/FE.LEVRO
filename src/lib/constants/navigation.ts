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
  { label: 'Roadmap', href: ROUTES.roadmap, icon: 'roadmap' },
  { label: 'Resume', href: ROUTES.resume, icon: 'resume' },
  { label: 'Cover Letter', href: ROUTES.coverLetter, icon: 'cover-letter' },
  { label: 'Applications', href: ROUTES.applications, icon: 'applications' },
  { label: 'Achievements', href: ROUTES.achievements, icon: 'achievements' },
]

export const SECONDARY_NAV: readonly NavItem[] = [
  { label: 'Settings', href: ROUTES.settings, icon: 'settings' },
]

/** Mobile bottom navigation — a focused five-item subset. */
export const MOBILE_NAV: readonly NavItem[] = [
  { label: 'Dashboard', href: ROUTES.dashboard, icon: 'dashboard' },
  { label: 'Coach', href: ROUTES.coach, icon: 'coach' },
  { label: 'Roadmap', href: ROUTES.roadmap, icon: 'roadmap' },
  { label: 'Resume', href: ROUTES.resume, icon: 'resume' },
  { label: 'Apps', href: ROUTES.applications, icon: 'applications' },
]
