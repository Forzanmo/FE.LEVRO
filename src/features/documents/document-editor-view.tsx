'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { DocumentSection, DocumentStatement } from '@/api/generated'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader } from '@/components/shared/page-header'
import { DYNAMIC_ROUTES } from '@/lib/constants/routes'
import { documentsService } from '@/services/api/documents-service'
import { analyticsService } from '@/services/api/analytics-service'

const ACCENTS = ['#315c5b', '#1f4b99', '#7a3e9d', '#8a3b3b', '#263238'] as const
type Accent = (typeof ACCENTS)[number]

function statementsFromText(text: string, previous: DocumentStatement[]): DocumentStatement[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({
      id: previous[index]?.id ?? crypto.randomUUID(),
      text: line,
      origin: previous[index]?.text === line ? previous[index].origin : 'user',
      evidence_ids: previous[index]?.evidence_ids ?? [],
      aligned_requirement_ids: previous[index]?.aligned_requirement_ids ?? [],
    }))
}

function SectionEditor({
  section,
  onSave,
  onRegenerate,
  pending,
  regenerating,
}: {
  section: DocumentSection
  onSave: (statements: DocumentStatement[]) => void
  onRegenerate: () => void
  pending: boolean
  regenerating: boolean
}) {
  const [value, setValue] = useState(() =>
    section.statements.map((statement) => statement.text).join('\n'),
  )
  const [savedValue, setSavedValue] = useState(value)

  const save = () => {
    if (value === savedValue || pending) return
    onSave(statementsFromText(value, section.statements))
    setSavedValue(value)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    save()
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{section.title}</CardTitle>
          <Badge variant="outline">{section.type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={submit}>
          <Textarea
            name="statements"
            rows={Math.max(4, section.statements.length + 2)}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onBlur={save}
            aria-label={`${section.title} statements`}
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs">
              One statement per line. Changes autosave when you leave this field.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onRegenerate}
                isLoading={regenerating}
              >
                Regenerate section
              </Button>
              <Button type="submit" size="sm" isLoading={pending} disabled={value === savedValue}>
                Save now
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function DocumentEditorView({ documentId }: { documentId: string }) {
  const queryClient = useQueryClient()
  const documentKey = ['document', documentId] as const
  const [template, setTemplate] = useState<'classic' | 'modern' | null>(null)
  const [accent, setAccent] = useState<Accent | null>(null)
  const [exportJobId, setExportJobId] = useState<string | null>(null)
  const [regenerationJobId, setRegenerationJobId] = useState<string | null>(null)
  const [regeneratingSectionId, setRegeneratingSectionId] = useState<string | null>(null)
  const editorEventRecorded = useRef(false)
  const regenerationHandled = useRef<string | null>(null)

  const document = useQuery({
    queryKey: documentKey,
    queryFn: () => documentsService.getGenerated(documentId),
  })
  const setDocument = (data: NonNullable<typeof document.data>) => queryClient.setQueryData(documentKey, data)

  useEffect(() => {
    if (!document.data || editorEventRecorded.current) return
    editorEventRecorded.current = true
    void analyticsService.editorOpened(document.data.application_id, document.data.id)
  }, [document.data])

  const preview = useQuery({
    queryKey: ['document-preview', documentId, document.data?.current_revision],
    queryFn: () => documentsService.preview(documentId),
    enabled: Boolean(document.data),
  })

  const sectionMutation = useMutation({
    mutationFn: ({ sectionId, statements }: { sectionId: string; statements: DocumentStatement[] }) =>
      documentsService.updateSection(documentId, sectionId, document.data!.current_revision, statements),
    onSuccess: (data) => {
      setDocument(data)
      void queryClient.invalidateQueries({ queryKey: ['document-preview', documentId] })
      toast.success('Section saved')
    },
    onError: (error: Error) => toast.error('Could not save section', { description: error.message }),
  })

  const presentationMutation = useMutation({
    mutationFn: () =>
      documentsService.updatePresentation(documentId, {
        expected_revision: document.data!.current_revision,
        template_id:
          template ??
          (document.data!.content.presentation?.template_id === 'modern' ? 'modern' : 'classic'),
        accent_color:
          accent ??
          (ACCENTS.includes(document.data!.content.presentation?.accent_color as Accent)
            ? (document.data!.content.presentation!.accent_color as Accent)
            : '#315c5b'),
      }),
    onSuccess: (data) => {
      setDocument(data)
      void queryClient.invalidateQueries({ queryKey: ['document-preview', documentId] })
      toast.success('Presentation updated')
    },
    onError: (error: Error) => toast.error('Could not update presentation', { description: error.message }),
  })

  const exportMutation = useMutation({
    mutationFn: () => documentsService.startExport(documentId),
    onSuccess: (job) => setExportJobId(job.id),
    onError: (error: Error) => toast.error('Could not start export', { description: error.message }),
  })

  const regenerationMutation = useMutation({
    mutationFn: (sectionId: string) =>
      documentsService.regenerateSection(
        documentId,
        sectionId,
        document.data!.current_revision,
      ),
    onSuccess: (job) => setRegenerationJobId(job.id),
    onError: (error: Error) => {
      setRegeneratingSectionId(null)
      toast.error('Could not regenerate section', { description: error.message })
    },
  })

  const regenerationJob = useQuery({
    queryKey: ['regeneration-job', regenerationJobId],
    queryFn: () => documentsService.getJob(regenerationJobId!),
    enabled: Boolean(regenerationJobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'queued' || status === 'processing' ? 1500 : false
    },
  })

  useEffect(() => {
    if (!regenerationJobId || regenerationHandled.current === regenerationJobId) return
    if (regenerationJob.data?.status === 'completed') {
      regenerationHandled.current = regenerationJobId
      void document.refetch()
      void queryClient.invalidateQueries({ queryKey: ['document-preview', documentId] })
      toast.success('Section regenerated')
    } else if (regenerationJob.data?.status === 'failed') {
      regenerationHandled.current = regenerationJobId
      toast.error('Section regeneration failed', {
        description: regenerationJob.data.error_code ?? 'Please try again.',
      })
    }
  }, [document, documentId, queryClient, regenerationJob.data, regenerationJobId])

  const exportJob = useQuery({
    queryKey: ['export-job', exportJobId],
    queryFn: () => documentsService.getJob(exportJobId!),
    enabled: Boolean(exportJobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'queued' || status === 'processing' ? 1500 : false
    },
  })

  const downloadMutation = useMutation({
    mutationFn: (exportId: string) => documentsService.download(exportId),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob)
      const anchor = window.document.createElement('a')
      anchor.href = url
      anchor.download = `${document.data?.content.title ?? 'levrro-document'}.pdf`
      anchor.click()
      URL.revokeObjectURL(url)
    },
    onError: (error: Error) => toast.error('Could not download PDF', { description: error.message }),
  })

  if (document.isLoading) return <Skeleton className="h-[40rem] w-full rounded-xl" />
  if (document.error || !document.data) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Document could not be loaded</AlertTitle>
        <AlertDescription>{document.error?.message ?? 'Document not found.'}</AlertDescription>
      </Alert>
    )
  }

  const data = document.data
  const exportReady = exportJob.data?.status === 'completed' && exportJob.data.result_id
  const selectedTemplate =
    template ?? (data.content.presentation?.template_id === 'modern' ? 'modern' : 'classic')
  const selectedAccent =
    accent ??
    (ACCENTS.includes(data.content.presentation?.accent_color as Accent)
      ? (data.content.presentation!.accent_color as Accent)
      : '#315c5b')

  return (
    <div className="space-y-6">
      <PageHeader
        title={data.content.title}
        description={`${data.document_type.replace('_', ' ')} · revision ${data.current_revision}`}
        actions={
          <Button variant="outline" asChild>
            <Link href={DYNAMIC_ROUTES.application(data.application_id)}>Back to application</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Presentation and export</CardTitle>
          <CardDescription>Choose a template and accent before creating the production PDF.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="space-y-2 lg:w-52">
            <Label>Template</Label>
            <Select value={selectedTemplate} onValueChange={(value) => setTemplate(value as 'classic' | 'modern')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Accent</Label>
            <div className="flex gap-2">
              {ACCENTS.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Use ${color} accent`}
                  aria-pressed={selectedAccent === color}
                  onClick={() => setAccent(color)}
                  className="size-9 rounded-full border-2 border-background ring-1 ring-foreground/20 aria-pressed:ring-2 aria-pressed:ring-primary"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <Button variant="outline" onClick={() => presentationMutation.mutate()} isLoading={presentationMutation.isPending}>Save style</Button>
          <Button variant="gradient" onClick={() => exportMutation.mutate()} isLoading={exportMutation.isPending || exportJob.data?.status === 'queued' || exportJob.data?.status === 'processing'}>
            Export PDF
          </Button>
          {exportReady ? (
            <Button onClick={() => downloadMutation.mutate(exportReady)} isLoading={downloadMutation.isPending} leftIcon={<Icon name="download" size="sm" />}>Download PDF</Button>
          ) : null}
        </CardContent>
      </Card>

      {exportJob.data?.status === 'failed' ? (
        <Alert variant="destructive">
          <AlertTitle>Export failed</AlertTitle>
          <AlertDescription>{exportJob.data.error_code ?? 'Please try again.'}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Live preview</CardTitle>
          <CardDescription>This is the same layout used for the exported PDF.</CardDescription>
        </CardHeader>
        <CardContent>
          {preview.isLoading ? (
            <Skeleton className="h-[40rem] w-full rounded-lg" />
          ) : preview.data ? (
            <iframe
              title="Document preview"
              srcDoc={preview.data}
              sandbox=""
              className="h-[40rem] w-full rounded-lg border bg-white"
            />
          ) : (
            <Alert variant="destructive">
              <AlertDescription>The preview could not be loaded.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        {data.content.sections.map((section) => (
          <SectionEditor
            key={`${section.id}-${section.statements.map((statement) => statement.text).join('\n')}`}
            section={section}
            pending={sectionMutation.isPending && sectionMutation.variables?.sectionId === section.id}
            regenerating={
              regeneratingSectionId === section.id &&
              regenerationJob.data?.status !== 'completed' &&
              regenerationJob.data?.status !== 'failed'
            }
            onSave={(statements) => sectionMutation.mutate({ sectionId: section.id, statements })}
            onRegenerate={() => {
              setRegeneratingSectionId(section.id)
              regenerationMutation.mutate(section.id)
            }}
          />
        ))}
      </div>
    </div>
  )
}
