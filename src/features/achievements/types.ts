import type { IconName } from '@/components/ui/icon'

export type AchievementStatus = 'earned' | 'in-progress' | 'locked'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: IconName
  xp: number
  status: AchievementStatus
  /** Present for in-progress achievements. */
  progress?: { current: number; target: number }
}
