'use client'

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { chatService } from '@/services/api/chat-service'
import type { ChatSession } from '@/features/chat/types'
import type { ChatDocumentCreate, DocumentType } from '@/api/generated'
import { DYNAMIC_ROUTES, ROUTES } from '@/lib/constants/routes'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader } from '@/components/shared/page-header'

export function ChatWorkspaceView() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [failedTurn, setFailedTurn] = useState<{ content: string; key: string } | null>(null)
  const [streamingTurn, setStreamingTurn] = useState<{
    sessionId: string
    userContent: string
    assistantContent: string
  } | null>(null)
  const composerRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [roleName, setRoleName] = useState('')
  const [organization, setOrganization] = useState('')
  const [opportunityText, setOpportunityText] = useState('')
  const [applicationType, setApplicationType] = useState<NonNullable<ChatDocumentCreate['application_type']>>('job')
  const [documentKey, setDocumentKey] = useState<string | null>(null)
  const [documentRequest, setDocumentRequest] = useState<{
    applicationId: string
    jobId: string
    documentTypes: DocumentType[]
  } | null>(null)
  const sessions = useQuery({ queryKey: ['chat-sessions'], queryFn: chatService.listSessions })
  const selectedId = activeId ?? sessions.data?.[0]?.id ?? null
  const active = useQuery({
    queryKey: ['chat-session', selectedId],
    queryFn: () => chatService.getSession(selectedId as string),
    enabled: Boolean(selectedId),
  })
  const create = useMutation({
    mutationFn: () => chatService.createSession(true),
    onSuccess: (session) => {
      queryClient.setQueryData(['chat-session', session.id], session)
      void queryClient.invalidateQueries({ queryKey: ['chat-sessions'] })
      setActiveId(session.id)
    },
  })
  const send = useMutation({
    mutationFn: ({ content, key, sessionId }: { content: string; key: string; sessionId: string }) =>
      chatService.streamMessage(sessionId, content, key, (text) => {
        setStreamingTurn((current) =>
          current?.sessionId === sessionId
            ? { ...current, assistantContent: current.assistantContent + text }
            : current,
        )
      }),
    onMutate: (turn) => {
      setStreamingTurn({
        sessionId: turn.sessionId,
        userContent: turn.content,
        assistantContent: '',
      })
    },
    onSuccess: (session) => {
      queryClient.setQueryData(['chat-session', session.id], session)
      void queryClient.invalidateQueries({ queryKey: ['chat-sessions'] })
      setStreamingTurn(null)
      setFailedTurn(null)
    },
    onError: (error: Error, turn) => {
      setStreamingTurn(null)
      setDraft(turn.content)
      setFailedTurn({ content: turn.content, key: turn.key })
      toast.error('Could not send message', { description: error.message })
    },
  })
  const buildDocuments = useMutation({
    mutationFn: ({ documentTypes, key }: { documentTypes: DocumentType[]; key: string }) =>
      chatService.createDocuments(
        selectedId as string,
        {
          role_name: roleName.trim(),
          organization: organization.trim() || null,
          opportunity_text: opportunityText.trim(),
          application_type: applicationType,
          document_types: documentTypes,
        },
        key,
      ),
    onSuccess: (result) => {
      setDocumentRequest({
        applicationId: result.application.id,
        jobId: result.job.id,
        documentTypes: result.document_types,
      })
      toast.success(result.job.status === 'completed' ? 'Documents are ready' : 'Document generation started')
    },
    onError: (error: Error) =>
      toast.error('Could not create documents', { description: error.message }),
  })
  const documentJob = useQuery({
    queryKey: ['chat-document-job', documentRequest?.jobId],
    queryFn: () => chatService.getJob(documentRequest!.jobId),
    enabled: Boolean(documentRequest?.jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'queued' || status === 'processing' ? 1500 : false
    },
  })
  const generatedDocuments = useQuery({
    queryKey: ['chat-generated-documents', documentRequest?.applicationId],
    queryFn: () => chatService.listDocuments(documentRequest!.applicationId),
    enabled: Boolean(
      documentRequest?.applicationId && documentJob.data?.status === 'completed',
    ),
  })
  const memory = useMutation({
    mutationFn: (value: boolean) => chatService.updateSession(selectedId as string, value),
    onSuccess: (session) => queryClient.setQueryData(['chat-session', session.id], session),
    onError: (error: Error) => toast.error('Could not update memory setting', { description: error.message }),
  })
  const continueToResume = useMutation({
    mutationFn: () => chatService.prepareResume(selectedId as string),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['resume-draft'] })
      router.push(ROUTES.resume)
    },
    onError: (error: Error) =>
      toast.error('Could not prepare the CV builder', { description: error.message }),
  })
  const loadOlder = useMutation({
    mutationFn: async () => {
      const current = queryClient.getQueryData<ChatSession>(['chat-session', selectedId])
      return chatService.listMessages(selectedId as string, 100, current?.messages.length ?? 0)
    },
    onSuccess: (older) => {
      queryClient.setQueryData<ChatSession>(['chat-session', selectedId], (current) => {
        if (!current) return current
        const seen = new Set(current.messages.map((message) => message.id))
        const combined = [...older.filter((message) => !seen.has(message.id)), ...current.messages]
        return {
          ...current,
          messages: combined,
          has_more_messages: combined.length < current.message_count,
        }
      })
    },
    onError: (error: Error) => toast.error('Could not load older messages', { description: error.message }),
  })
  const remove = useMutation({
    mutationFn: () => chatService.deleteSession(selectedId as string),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['chat-session', selectedId] })
      setActiveId(null)
      void queryClient.invalidateQueries({ queryKey: ['chat-sessions'] })
      toast.success('Conversation deleted')
    },
    onError: (error: Error) => toast.error('Could not delete conversation', { description: error.message }),
  })
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const content = draft.trim()
    if (content && selectedId && !send.isPending) {
      const key = failedTurn?.content === content ? failedTurn.key : crypto.randomUUID()
      setDraft('')
      send.mutate({ content, key, sessionId: selectedId })
    }
  }
  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }
  useEffect(() => {
    const composer = composerRef.current
    if (!composer) return
    composer.style.height = 'auto'
    composer.style.height = `${Math.min(composer.scrollHeight, 160)}px`
  }, [draft])
  useEffect(() => {
    if (streamingTurn?.sessionId === selectedId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [selectedId, streamingTurn?.assistantContent, streamingTurn?.sessionId])
  const startDocuments = (documentTypes: DocumentType[]) => {
    if (!selectedId || !roleName.trim() || !opportunityText.trim()) {
      toast.error('Add the target role and opportunity description first')
      return
    }
    const key = documentKey ?? crypto.randomUUID()
    setDocumentKey(key)
    buildDocuments.mutate({ documentTypes, key })
  }
  if (sessions.isLoading) return <Skeleton className="h-[38rem] w-full rounded-xl" />
  const session = active.data
  return (
    <div className="space-y-5">
      <PageHeader title="AI workspace" description="One conversation for your CV, cover letter, and career evidence." />
      <div className="grid min-h-[min(72vh,52rem)] gap-4 lg:grid-cols-[17rem_minmax(0,1fr)_16rem]">
        <Card className="flex flex-col p-3">
          <Button onClick={() => create.mutate()} isLoading={create.isPending}>New chat</Button>
          <div className="mt-3 space-y-1 overflow-auto">
            {sessions.data?.map((item) => (
              <button key={item.id} type="button" onClick={() => setActiveId(item.id)} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${item.id === selectedId ? 'bg-brand/10 text-brand' : 'hover:bg-muted'}`}>
                <span className="block truncate">{item.title}</span>
                <span className="text-muted-foreground text-xs">{item.use_shared_memory ? 'Shared memory' : 'Private chat'}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card className="flex min-h-0 flex-col overflow-hidden">
          {!session ? (
            <div className="flex flex-1 items-center justify-center p-8 text-center"><div><h2 className="text-xl font-semibold">Start a career chat</h2><p className="text-muted-foreground mt-2">Tell Levrro what you want to build and it will collect the evidence needed for your documents.</p><Button className="mt-5" onClick={() => create.mutate()}>Start new chat</Button></div></div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 border-b p-4">
                <div><div className="font-semibold">{session.title}</div><div className="text-muted-foreground text-xs">Your conversation is saved automatically.</div></div>
                <div className="flex flex-wrap justify-end gap-2">
                  <Button type="button" size="sm" variant="outline" isLoading={continueToResume.isPending} onClick={() => continueToResume.mutate()}>
                    CV builder
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={ROUTES.coverLetter}>Cover letter builder</Link>
                  </Button>
                </div>
              </div>
              <div className="flex-1 space-y-4 overflow-auto p-5">
                {session.has_more_messages ? <div className="flex justify-center"><Button type="button" variant="ghost" size="sm" isLoading={loadOlder.isPending} onClick={() => loadOlder.mutate()}>Load older messages</Button></div> : null}
                {session.messages.map((message) => <div key={message.id} className={`${message.role === 'user' ? 'ml-auto max-w-[85%] rounded-2xl bg-brand px-4 py-3 text-sm text-white' : 'max-w-[85%] rounded-2xl bg-muted px-4 py-3 text-sm'} whitespace-pre-wrap break-words`}>{message.content}</div>)}
                {streamingTurn?.sessionId === selectedId ? <>
                  <div className="ml-auto max-w-[85%] whitespace-pre-wrap break-words rounded-2xl bg-brand px-4 py-3 text-sm text-white">{streamingTurn.userContent}</div>
                  <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl bg-muted px-4 py-3 text-sm" aria-live="polite">
                    {streamingTurn.assistantContent || <span className="text-muted-foreground animate-pulse">Thinking…</span>}
                  </div>
                </> : null}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={submit} className="border-t p-4">
                <div className="flex items-end gap-2 rounded-2xl border bg-background p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring/50">
                  <Textarea
                    ref={composerRef}
                    rows={1}
                    value={draft}
                    onChange={(event) => { setDraft(event.target.value); if (failedTurn?.content !== event.target.value.trim()) setFailedTurn(null) }}
                    onKeyDown={handleComposerKeyDown}
                    placeholder="Message Levrro…"
                    disabled={send.isPending}
                    className="max-h-40 min-h-10 resize-none border-0 bg-transparent px-2 py-2 shadow-none focus-visible:ring-0"
                    aria-label="Chat message"
                  />
                  <Button type="submit" isLoading={send.isPending} disabled={!draft.trim()} className="shrink-0">{failedTurn?.content === draft.trim() ? 'Retry' : 'Send'}</Button>
                </div>
                <p className="text-muted-foreground mt-1.5 px-2 text-xs">Enter to send · Shift+Enter for a new line</p>
                <button type="button" className="text-brand mt-1 px-2 text-left text-xs font-medium hover:underline" disabled={continueToResume.isPending} onClick={() => continueToResume.mutate()}>
                  Skip the remaining questions and open the CV builder with the facts gathered so far
                </button>
              </form>
            </>
          )}
        </Card>
        <Card className="space-y-4 p-4">
          <div><div className="font-semibold">Shared memory</div><p className="text-muted-foreground mt-1 text-xs">Choose whether this chat can read and update your shared profile evidence.</p></div>
          {session ? <div className="flex items-center justify-between gap-3"><span className="text-sm">Use shared memory</span><Switch checked={session.use_shared_memory} onCheckedChange={(value) => memory.mutate(value)} /></div> : null}
          <Alert><AlertTitle>Build from this chat</AlertTitle><AlertDescription>Your messages become the confirmed source evidence. Assistant messages are never used as applicant facts.</AlertDescription></Alert>
          {session ? <div className="space-y-3 border-t pt-4">
            <div className="space-y-1.5"><Label htmlFor="chat-role">Target role or program</Label><Input id="chat-role" value={roleName} onChange={(event) => { setRoleName(event.target.value); setDocumentKey(null) }} placeholder="UI/UX Design Intern" /></div>
            <div className="space-y-1.5"><Label htmlFor="chat-organization">Organization (optional)</Label><Input id="chat-organization" value={organization} onChange={(event) => { setOrganization(event.target.value); setDocumentKey(null) }} /></div>
            <div className="space-y-1.5"><Label htmlFor="chat-application-type">Application type</Label><select id="chat-application-type" className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm" value={applicationType} onChange={(event) => { setApplicationType(event.target.value as typeof applicationType); setDocumentKey(null) }}><option value="job">Job</option><option value="internship">Internship</option><option value="scholarship">Scholarship</option></select></div>
            <div className="space-y-1.5"><Label htmlFor="chat-opportunity">Opportunity description</Label><Textarea id="chat-opportunity" rows={5} value={opportunityText} onChange={(event) => { setOpportunityText(event.target.value); setDocumentKey(null) }} placeholder="Paste the job, internship, or scholarship description…" /></div>
            <div className="grid gap-2"><Button type="button" variant="gradient" isLoading={buildDocuments.isPending} onClick={() => startDocuments(['cv', 'cover_letter'])}>Create CV and cover letter</Button><div className="grid grid-cols-2 gap-2"><Button type="button" variant="outline" disabled={buildDocuments.isPending} onClick={() => startDocuments(['cv'])}>CV only</Button><Button type="button" variant="outline" disabled={buildDocuments.isPending} onClick={() => startDocuments(['cover_letter'])}>Cover letter only</Button></div></div>
            {documentJob.data ? <Alert variant={documentJob.data.status === 'failed' ? 'destructive' : 'default'}><AlertTitle>Generation {documentJob.data.status}</AlertTitle><AlertDescription>{documentJob.data.error_code ?? (documentJob.data.status === 'completed' ? 'Your templated documents are ready to review and export as PDF.' : 'Gemini is packaging the confirmed chat evidence into your selected documents.')}</AlertDescription></Alert> : null}
            {generatedDocuments.data?.length ? <div className="grid gap-2">{generatedDocuments.data.filter((document) => documentRequest?.documentTypes.includes(document.document_type)).map((document) => <Button key={document.id} asChild variant="outline"><Link href={DYNAMIC_ROUTES.generatedDocument(document.id)}>Review {document.document_type === 'cv' ? 'CV' : 'cover letter'}</Link></Button>)}</div> : null}
          </div> : null}
          <div className="grid gap-2"><Button asChild variant="ghost"><Link href={ROUTES.documents}>Open document library</Link></Button></div>
          {session ? <div className="border-t pt-4"><p className="text-muted-foreground mb-2 text-xs">Deleting removes this transcript and its shared notes. Structured profile facts already accepted from the chat remain in your profile.</p><Button type="button" variant="destructive" className="w-full" isLoading={remove.isPending} onClick={() => { if (window.confirm('Delete this conversation permanently?')) remove.mutate() }}>Delete conversation</Button></div> : null}
        </Card>
      </div>
    </div>
  )
}
