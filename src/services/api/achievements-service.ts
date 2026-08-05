import { getAchievementsApiV1ProductAchievementsGet } from '@/api/generated'
import type { IconName } from '@/components/ui/icon'
import type { Achievement } from '@/features/achievements/types'
import { unwrapApiResult } from '@/lib/api/http-client'
import '@/lib/api/runtime'

export const achievementsService = {
  async getAchievements(): Promise<Achievement[]> {
    const data = unwrapApiResult(await getAchievementsApiV1ProductAchievementsGet())
    return data.map((achievement) => ({
      ...achievement,
      icon: achievement.icon as IconName,
      progress: achievement.progress ?? undefined,
    }))
  },
}
