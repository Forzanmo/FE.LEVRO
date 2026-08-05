import { getDashboardApiV1ProductDashboardGet } from '@/api/generated'
import type { DashboardResponse } from '@/api/generated'
import type { IconName } from '@/components/ui/icon'
import type { DashboardOverview } from '@/features/dashboard/types'
import type { HeatmapLevel } from '@/features/dashboard/types'
import { unwrapApiResult } from '@/lib/api/http-client'
import '@/lib/api/runtime'

function mapDashboard(data: DashboardResponse): DashboardOverview {
  return {
    userName: data.user_name,
    streakDays: data.streak_days,
    score: data.score,
    mission: {
      id: data.mission.id,
      title: data.mission.title,
      description: data.mission.description,
      xp: data.mission.xp,
      estimatedMinutes: data.mission.estimated_minutes,
      icon: data.mission.icon as IconName,
    },
    roadmap: {
      completed: data.roadmap.completed,
      total: data.roadmap.total,
      nextQuest: data.roadmap.next_quest,
    },
    heatmap: data.heatmap.map((day) => ({
      date: day.date,
      level: Math.max(0, Math.min(4, day.level)) as HeatmapLevel,
    })),
    activity: data.activity.map((item) => ({
      id: item.id,
      title: item.title,
      timestamp: item.timestamp,
      type: item.type,
      icon: item.icon as IconName,
    })),
    applications: data.applications,
  }
}

export const dashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    return mapDashboard(unwrapApiResult(await getDashboardApiV1ProductDashboardGet()))
  },
}
