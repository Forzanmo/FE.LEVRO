import type { Metadata } from 'next'

import { RoadmapView } from '@/features/roadmap/roadmap-view'

export const metadata: Metadata = {
  title: 'Roadmap',
}

export default function RoadmapPage() {
  return <RoadmapView />
}
