import { authenticatedFetch } from '@/lib/api/runtime'
import {
  createChatDocumentJobApiV1ChatSessionsSessionIdDocumentJobsPost,
  getJobApiV1JobsJobIdGet,
  listDocumentsApiV1ApplicationsApplicationIdDocumentsGet,
} from '@/api/generated'
import type { ChatDocumentCreate } from '@/api/generated'
import { unwrapApiResult } from '@/lib/api/http-client'

import type { ChatMessage, ChatSession, ChatSessionSummary } from '@/features/chat/types'

async function json<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T & { error?: { message?: string } }
  if (!response.ok) throw new Error(body.error?.message ?? 'The chat request could not be completed.')
  return body as T
}

type StreamEvent =
  | { event: 'start'; user_message_id: string | null; assistant_message_id: string }
  | { event: 'delta'; text: string }
  | { event: 'done'; session: ChatSession }
  | { event: 'error'; code: string; message: string; retryable: boolean }

async function readChatStream(
  response: Response,
  onDelta: (text: string) => void,
): Promise<ChatSession> {
  if (!response.ok || !response.body) {
    const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
    throw new Error(body?.error?.message ?? 'The chat stream could not be started.')
  }
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let completed: ChatSession | null = null

  const consume = (line: string) => {
    if (!line.trim()) return
    const event = JSON.parse(line) as StreamEvent
    if (event.event === 'delta') onDelta(event.text)
    if (event.event === 'done') completed = event.session
    if (event.event === 'error') throw new Error(event.message)
  }

  while (true) {
    const { value, done } = await reader.read()
    buffer += decoder.decode(value, { stream: !done })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    lines.forEach(consume)
    if (done) break
  }
  consume(buffer)
  if (!completed) throw new Error('The chat stream ended before the response was saved.')
  return completed
}

export const chatService = {
  async listSessions() {
    return json<ChatSessionSummary[]>(await authenticatedFetch('/api/v1/chat/sessions'))
  },
  async getSession(id: string) {
    return json<ChatSession>(await authenticatedFetch(`/api/v1/chat/sessions/${id}`))
  },
  async listMessages(id: string, limit = 50, offset = 0) {
    const query = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    return json<ChatMessage[]>(
      await authenticatedFetch(`/api/v1/chat/sessions/${id}/messages?${query}`),
    )
  },
  async createSession(useSharedMemory = true) {
    return json<ChatSession>(
      await authenticatedFetch('/api/v1/chat/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ use_shared_memory: useSharedMemory }),
      }),
    )
  },
  async updateSession(id: string, useSharedMemory: boolean) {
    return json<ChatSession>(
      await authenticatedFetch(`/api/v1/chat/sessions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ use_shared_memory: useSharedMemory }),
      }),
    )
  },
  async deleteSession(id: string) {
    const response = await authenticatedFetch(`/api/v1/chat/sessions/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const body = (await response.json()) as { error?: { message?: string } }
      throw new Error(body.error?.message ?? 'The conversation could not be deleted.')
    }
  },
  async sendMessage(id: string, content: string, idempotencyKey: string) {
    return json<ChatSession>(
      await authenticatedFetch(`/api/v1/chat/sessions/${id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({ content }),
      }),
    )
  },
  async streamMessage(
    id: string,
    content: string,
    idempotencyKey: string,
    onDelta: (text: string) => void,
  ) {
    const response = await authenticatedFetch(`/api/v1/chat/sessions/${id}/messages/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/x-ndjson',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({ content }),
    })
    return readChatStream(response, onDelta)
  },
  async prepareResume(id: string) {
    return json<unknown>(
      await authenticatedFetch(`/api/v1/chat/sessions/${id}/resume-draft`, {
        method: 'POST',
      }),
    )
  },
  async createDocuments(
    id: string,
    body: ChatDocumentCreate,
    idempotencyKey: string,
  ) {
    return unwrapApiResult(
      await createChatDocumentJobApiV1ChatSessionsSessionIdDocumentJobsPost({
        path: { session_id: id },
        body,
        headers: { 'Idempotency-Key': idempotencyKey },
      }),
    )
  },
  async getJob(id: string) {
    return unwrapApiResult(await getJobApiV1JobsJobIdGet({ path: { job_id: id } }))
  },
  async listDocuments(applicationId: string) {
    return unwrapApiResult(
      await listDocumentsApiV1ApplicationsApplicationIdDocumentsGet({
        path: { application_id: applicationId },
      }),
    )
  },
}
