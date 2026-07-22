'use client'

import { useMemo, useState } from 'react'

import { roadmapService } from '@/services/api/roadmap-service'

import type { QuestNodeWithStatus, QuestStatus, RoadmapStats } from './types'

const XP_PER_LEVEL = 200

export interface UseRoadmap {
  cols: number
  nodes: QuestNodeWithStatus[]
  stats: RoadmapStats
  complete: (id: string) => void
  uncomplete: (id: string) => void
  isComplete: (id: string) => boolean
}

export function useRoadmap(): UseRoadmap {
  const data = useMemo(() => roadmapService.getRoadmap(), [])
  const [completed, setCompleted] = useState<Set<string>>(() => new Set(data.initialCompleted))

  const statusOf = (id: string, requires: string[]): QuestStatus => {
    if (completed.has(id)) return 'completed'
    return requires.every((r) => completed.has(r)) ? 'available' : 'locked'
  }

  const nodes: QuestNodeWithStatus[] = data.nodes.map((node) => ({
    ...node,
    status: statusOf(node.id, node.requires),
  }))

  const stats: RoadmapStats = useMemo(() => {
    const totalXp = data.nodes.reduce((sum, n) => sum + n.xp, 0)
    const earnedXp = data.nodes
      .filter((n) => completed.has(n.id))
      .reduce((sum, n) => sum + n.xp, 0)
    const total = data.nodes.length
    const completedCount = data.nodes.filter((n) => completed.has(n.id)).length
    return {
      earnedXp,
      totalXp,
      total,
      completedCount,
      level: Math.floor(earnedXp / XP_PER_LEVEL) + 1,
      progress: total === 0 ? 0 : Math.round((completedCount / total) * 100),
    }
  }, [data.nodes, completed])

  const complete = (id: string) => {
    const node = data.nodes.find((n) => n.id === id)
    if (!node) return
    if (statusOf(id, node.requires) !== 'available') return
    setCompleted((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const uncomplete = (id: string) => {
    setCompleted((prev) => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  return {
    cols: data.cols,
    nodes,
    stats,
    complete,
    uncomplete,
    isComplete: (id: string) => completed.has(id),
  }
}
