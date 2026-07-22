import type { IconName } from '@/components/ui/icon'

export interface ScoreCategory {
  id: string
  label: string
  /** 0–100. */
  score: number
  /** Evidence-based reasoning shown when the category is expanded. */
  reasoning: string
}

export interface CareerScore {
  /** 0–100. */
  overall: number
  /** Change since last assessment (percentage points). */
  delta: number
  categories: ScoreCategory[]
}

export interface Mission {
  id: string
  title: string
  description: string
  xp: number
  estimatedMinutes: number
  icon: IconName
}

export type ActivityType = 'resume' | 'coach' | 'roadmap' | 'application' | 'achievement'

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

export interface RoadmapProgress {
  completed: number
  total: number
  nextQuest: string
}

export type HeatmapLevel = 0 | 1 | 2 | 3 | 4

export interface HeatmapDay {
  /** ISO date (YYYY-MM-DD). */
  date: string
  level: HeatmapLevel
}

export interface DashboardOverview {
  userName: string
  streakDays: number
  score: CareerScore
  mission: Mission
  roadmap: RoadmapProgress
  heatmap: HeatmapDay[]
  activity: ActivityItem[]
  applications: ApplicationsSummary
}
