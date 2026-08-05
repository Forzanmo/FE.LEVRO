'use client'

import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { roadmapService, type RoadmapSession } from '@/services/api/roadmap-service'

import type { QuestNodeWithStatus, QuestStatus, RoadmapStats } from './types'

const XP_PER_LEVEL = 200
const roadmapKey = ['roadmap'] as const

export interface UseRoadmap {
  cols: number
  nodes: QuestNodeWithStatus[]
  stats: RoadmapStats
  complete: (id: string) => Promise<void>
  uncomplete: (id: string) => Promise<void>
  isComplete: (id: string) => boolean
  isPending: boolean
  isError: boolean
  isSaving: boolean
  retry: () => void
}

export function useRoadmap(): UseRoadmap {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: roadmapKey, queryFn: () => roadmapService.getRoadmap() })
  const data = query.data
  const completed = useMemo(() => new Set(data?.initialCompleted ?? []), [data?.initialCompleted])

  const mutation = useMutation({
    mutationFn: ({ id, action, revision }: { id: string; action: 'complete' | 'uncomplete'; revision: number }) =>
      action === 'complete'
        ? roadmapService.complete(id, revision)
        : roadmapService.uncomplete(id, revision),
    onSuccess: (next) => queryClient.setQueryData<RoadmapSession>(roadmapKey, next),
  })

  const statusOf = (id: string, requires: string[]): QuestStatus => {
    if (completed.has(id)) return 'completed'
    return requires.every((requirement) => completed.has(requirement)) ? 'available' : 'locked'
  }

  const nodes: QuestNodeWithStatus[] = (data?.nodes ?? []).map((node) => ({
    ...node,
    status: statusOf(node.id, node.requires),
  }))

  const stats: RoadmapStats = useMemo(() => {
    const catalog = data?.nodes ?? []
    const totalXp = catalog.reduce((sum, node) => sum + node.xp, 0)
    const earnedXp = catalog
      .filter((node) => completed.has(node.id))
      .reduce((sum, node) => sum + node.xp, 0)
    const completedCount = catalog.filter((node) => completed.has(node.id)).length
    return {
      earnedXp,
      totalXp,
      total: catalog.length,
      completedCount,
      level: Math.floor(earnedXp / XP_PER_LEVEL) + 1,
      progress: catalog.length === 0 ? 0 : Math.round((completedCount / catalog.length) * 100),
    }
  }, [data?.nodes, completed])

  const mutate = async (id: string, action: 'complete' | 'uncomplete') => {
    if (!data) return
    await mutation.mutateAsync({ id, action, revision: data.revision })
  }

  return {
    cols: data?.cols ?? 3,
    nodes,
    stats,
    complete: (id) => mutate(id, 'complete'),
    uncomplete: (id) => mutate(id, 'uncomplete'),
    isComplete: (id) => completed.has(id),
    isPending: query.isPending,
    isError: query.isError,
    isSaving: mutation.isPending,
    retry: () => void query.refetch(),
  }
}
