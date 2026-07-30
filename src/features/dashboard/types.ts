import type { IconName } from '@/components/ui/icon'
import type { DocumentSummary } from '@/features/documents/types'

/** How well a skill is currently evidenced in the user's documents. */
export type SkillStrength = 'strong' | 'partial' | 'missing'

export interface SkillCoverage {
  id: string
  label: string
  strength: SkillStrength
  /**
   * Why it reads that way — which document evidences it, or what is absent.
   * Evidence over assertion: a strength label without its reason is a verdict.
   */
  evidence: string
}

/** The skills picture for the user's target role. */
export interface SkillsSummary {
  targetRole: string
  skills: SkillCoverage[]
}

export type ActivityType = 'cv' | 'cover-letter' | 'coach' | 'application' | 'achievement'

export interface ActivityItem {
  id: string
  title: string
  timestamp: string
  type: ActivityType
  icon: IconName
}

export interface ApplicationsSummary {
  total: number
  interviewing: number
  offers: number
}

export interface DashboardOverview {
  userName: string
  /**
   * True in the window between finishing the assessment and seeing the
   * dashboard for the first time.
   */
  isFirstRun: boolean
  /**
   * Whether the assessment has been completed. When false, `skills` describes
   * nothing the user has actually done and must not be rendered as if it does.
   */
  hasAssessment: boolean
  streakDays: number
  skills: SkillsSummary
  documents: DocumentSummary[]
  activity: ActivityItem[]
  applications: ApplicationsSummary
}
