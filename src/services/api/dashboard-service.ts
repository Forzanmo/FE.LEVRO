import { getDashboardApiV1ProductDashboardGet } from '@/api/generated'
import type { DashboardResponse } from '@/api/generated'
import type { IconName } from '@/components/ui/icon'
import type {
  ActivityItem,
  DashboardOverview,
  SkillStrength,
} from '@/features/dashboard/types'
import { unwrapApiResult } from '@/lib/api/http-client'
import '@/lib/api/runtime'

function strength(score: number): SkillStrength {
  if (score >= 70) return 'strong'
  if (score >= 35) return 'partial'
  return 'missing'
}

function mapDashboard(data: DashboardResponse): DashboardOverview {
  const hasAssessment = data.score.overall > 0 || data.score.categories.some((item) => item.score > 0)

  return {
    userName: data.user_name,
    isFirstRun: false,
    hasAssessment,
    streakDays: data.streak_days,
    skills: {
      targetRole: 'Your target role',
      skills: data.score.categories.map((category) => ({
        id: category.id,
        label: category.label,
        strength: strength(category.score),
        evidence: category.reasoning,
      })),
    },
    documents: [],
    activity: data.activity.map(
      (item): ActivityItem => ({
        id: item.id,
        title: item.title,
        timestamp: item.timestamp,
        type: item.type === 'resume' ? 'cv' : item.type === 'roadmap' ? 'coach' : item.type,
        icon: item.icon as IconName,
      }),
    ),
    applications: data.applications,
  }
}

export const dashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    return mapDashboard(unwrapApiResult(await getDashboardApiV1ProductDashboardGet()))
  },
}
