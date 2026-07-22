import type { IconName } from '@/components/ui/icon'

export type QuestStatus = 'completed' | 'available' | 'locked'

export interface QuestNode {
  id: string
  title: string
  description: string
  xp: number
  icon: IconName
  /** Row in the tree (0 = top). */
  tier: number
  /** Column slot within the grid (0-based). */
  col: number
  /** Prerequisite node ids — all must be completed to unlock. */
  requires: string[]
}

export interface RoadmapData {
  /** Number of columns the tree grid spans. */
  cols: number
  nodes: QuestNode[]
  initialCompleted: string[]
}

export interface QuestNodeWithStatus extends QuestNode {
  status: QuestStatus
}

export interface RoadmapStats {
  earnedXp: number
  totalXp: number
  completedCount: number
  total: number
  level: number
  /** 0–100 overall completion. */
  progress: number
}
