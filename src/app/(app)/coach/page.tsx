import type { Metadata } from 'next'

import { CoachView } from '@/features/coach/coach-view'

export const metadata: Metadata = {
  title: 'AI Coach',
}

export default function CoachPage() {
  return <CoachView />
}
