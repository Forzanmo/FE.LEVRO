import {
  completeQuestApiV1ProductRoadmapQuestIdCompletionPut,
  getRoadmapApiV1ProductRoadmapGet,
  uncompleteQuestApiV1ProductRoadmapQuestIdCompletionDelete,
} from '@/api/generated'
import type { RoadmapResponse } from '@/api/generated'
import type { IconName } from '@/components/ui/icon'
import type { RoadmapData } from '@/features/roadmap/types'
import { unwrapApiResult } from '@/lib/api/http-client'
import '@/lib/api/runtime'

export interface RoadmapSession extends RoadmapData {
  revision: number
}

function mapRoadmap(data: RoadmapResponse): RoadmapSession {
  return {
    cols: data.cols,
    initialCompleted: data.completed_quest_ids,
    revision: data.revision,
    nodes: data.nodes.map((node) => ({ ...node, icon: node.icon as IconName })),
  }
}

export const roadmapService = {
  async getRoadmap(): Promise<RoadmapSession> {
    return mapRoadmap(unwrapApiResult(await getRoadmapApiV1ProductRoadmapGet()))
  },

  async complete(id: string, expectedRevision: number): Promise<RoadmapSession> {
    return mapRoadmap(
      unwrapApiResult(
        await completeQuestApiV1ProductRoadmapQuestIdCompletionPut({
          path: { quest_id: id },
          body: { expected_revision: expectedRevision },
        }),
      ),
    )
  },

  async uncomplete(id: string, expectedRevision: number): Promise<RoadmapSession> {
    return mapRoadmap(
      unwrapApiResult(
        await uncompleteQuestApiV1ProductRoadmapQuestIdCompletionDelete({
          path: { quest_id: id },
          body: { expected_revision: expectedRevision },
        }),
      ),
    )
  },
}
