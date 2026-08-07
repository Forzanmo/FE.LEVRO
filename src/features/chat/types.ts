export type ChatRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  created_at: string
}

export interface ChatSession {
  id: string
  title: string
  use_shared_memory: boolean
  created_at: string
  updated_at: string
  messages: ChatMessage[]
  message_count: number
  has_more_messages: boolean
  memory: Record<string, unknown>
}

export interface ChatSessionSummary {
  id: string
  title: string
  use_shared_memory: boolean
  created_at: string
  updated_at: string
}
