'use client'

import { useState, type FormEvent } from 'react'
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
  pending,
}: {
  section: DocumentSection
  onSave: (statements: DocumentStatement[]) => void
  pending: boolean
}) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onSave(statementsFromText(String(form.get('statements') ?? ''), section.statements))
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
            defaultValue={section.statements.map((statement) => statement.text).join('\n')}
            aria-label={`${section.title} statements`}
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs">One statement per line. Evidence links are preserved for unchanged lines.</p>
            <Button type="submit" size="sm" isLoading={pending}>Save section</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function DocumentEditorView({ documentId }: { documentId: string }) {
  const queryClient = useQueryClient()
  const documentKey = ['document', documentId] as const
  const [template, setTemplate] = useState<'classic' | 'modern'>('classic')
  const [accent, setAccent] = useState<Accent>('#315c5b')
  const [exportJobId, setExportJobId] = useState<string | null>(null)

  const document = useQuery({
    queryKey: documentKey,
    queryFn: () => documentsService.getGenerated(documentId),
  })
  const setDocument = (data: NonNullable<typeof document.data>) => queryClient.setQueryData(documentKey, data)

  const sectionMutation = useMutation({
    mutationFn: ({ sectionId, statements }: { sectionId: string; statements: DocumentStatement[] }) =>
      documentsService.updateSection(documentId, sectionId, document.data!.current_revision, statements),
    onSuccess: (data) => {
      setDocument(data)
      toast.success('Section saved')
    },
    onError: (error: Error) => toast.error('Could not save section', { description: error.message }),
  })

  const presentationMutation = useMutation({
    mutationFn: () => documentsService.updatePresentation(documentId, {
      expected_revision: document.data!.current_revision,
      template_id: template,
      accent_color: accent,
    }),
    onSuccess: (data) => {
      setDocument(data)
      toast.success('Presentation updated')
    },
    onError: (error: Error) => toast.error('Could not update presentation', { description: error.message }),
  })

  const exportMutation = useMutation({
    mutationFn: () => documentsService.startExport(documentId),
    onSuccess: (job) => setExportJobId(job.id),
    onError: (error: Error) => toast.error('Could not start export', { description: error.message }),
  })

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
      anchor.download = `${document.data?.content.title ?? 'levvro-document'}.pdf`
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
            <Select value={template} onValueChange={(value) => setTemplate(value as 'classic' | 'modern')}>
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
                  aria-pressed={accent === color}
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

      <div className="grid gap-5 xl:grid-cols-2">
        {data.content.sections.map((section) => (
          <SectionEditor
            key={`${section.id}-${data.current_revision}`}
            section={section}
            pending={sectionMutation.isPending && sectionMutation.variables?.sectionId === section.id}
            onSave={(statements) => sectionMutation.mutate({ sectionId: section.id, statements })}
          />
        ))}
      </div>
    </div>
  )
}
