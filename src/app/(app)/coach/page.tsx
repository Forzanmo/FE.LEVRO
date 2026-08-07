import type { Metadata } from 'next'

import { ChatWorkspaceView } from '@/features/chat/chat-workspace-view'

export const metadata: Metadata = {
  title: 'AI workspace',
}

export default function CoachPage() {
  return <ChatWorkspaceView />
}
