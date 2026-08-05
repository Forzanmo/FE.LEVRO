'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { QuestionResponse } from '@/api/generated'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Icon } from '@/components/ui/icon'
import { PageHeader } from '@/components/shared/page-header'
import { DYNAMIC_ROUTES, ROUTES } from '@/lib/constants/routes'
import { applicationWorkflowService } from '@/services/api/application-workflow-service'

function QuestionAnswer({
  question,
  onSubmit,
  pending,
}: {
  question: QuestionResponse
  onSubmit: (value: string | number | boolean | string[]) => void
  pending: boolean
}) {
  const [value, setValue] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (question.question_type === 'number') onSubmit(Number(value))
    else if (question.question_type === 'yes_no') onSubmit(value === 'yes')
    else if (question.question_type === 'multiple_choice') {
      onSubmit(value.split(',').map((item) => item.trim()).filter(Boolean))
    } else onSubmit(value)
  }

  const options = question.question_type === 'yes_no' ? ['yes', 'no'] : question.options

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div>
        <Label htmlFor={`answer-${question.id}`}>{question.label}</Label>
        {question.help_text ? <p className="text-muted-foreground mt-1 text-sm">{question.help_text}</p> : null}
      </div>
      {options ? (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Button
              key={option}
              type="button"
              variant={value === option ? 'default' : 'outline'}
              onClick={() => setValue(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      ) : question.question_type === 'long_text' || question.question_type === 'multiple_choice' ? (
        <Textarea
          id={`answer-${question.id}`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={question.question_type === 'multiple_choice' ? 'Separate answers with commas' : undefined}
          required={question.is_required}
        />
      ) : (
        <Input
          id={`answer-${question.id}`}
          type={question.question_type === 'number' ? 'number' : question.question_type === 'date' ? 'date' : 'text'}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          required={question.is_required}
        />
      )}
      <Button type="submit" isLoading={pending} disabled={!value && question.is_required}>
        Save and continue
      </Button>
    </form>
  )
}

export function ApplicationWorkspaceView({ applicationId }: { applicationId: string }) {
  const queryClient = useQueryClient()
  const workspaceKey = ['application-workspace', applicationId] as const
  const [cv, setCv] = useState<File | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)

  const workspace = useQuery({
    queryKey: workspaceKey,
    queryFn: () => applicationWorkflowService.getWorkspace(applicationId),
  })
  const refresh = () => queryClient.invalidateQueries({ queryKey: workspaceKey })

  const opportunityMutation = useMutation({
    mutationFn: (body: { role_name: string; organization: string | null; description: string; expected_revision: number | null }) =>
      applicationWorkflowService.saveOpportunity(applicationId, body),
    onSuccess: () => {
      void refresh()
      toast.success('Opportunity saved')
    },
    onError: (error: Error) => toast.error('Could not save opportunity', { description: error.message }),
  })

  const uploadMutation = useMutation({
    mutationFn: (file: File) => applicationWorkflowService.uploadCv(applicationId, file),
    onSuccess: () => {
      setCv(null)
      void refresh()
      toast.success('CV uploaded')
    },
    onError: (error: Error) => toast.error('Could not upload CV', { description: error.message }),
  })

  const confirmMutation = useMutation({
    mutationFn: () => applicationWorkflowService.confirmExtraction(applicationId, workspace.data!.extraction!),
    onSuccess: () => {
      void refresh()
      toast.success('CV details confirmed')
    },
    onError: (error: Error) => toast.error('Could not confirm extraction', { description: error.message }),
  })

  const answerMutation = useMutation({
    mutationFn: ({ question, value }: { question: QuestionResponse; value: string | number | boolean | string[] }) =>
      applicationWorkflowService.saveAnswer(applicationId, question.id, {
        value,
        expected_revision: question.answer_revision,
      }),
    onSuccess: () => void refresh(),
    onError: (error: Error) => toast.error('Could not save answer', { description: error.message }),
  })

  const generationMutation = useMutation({
    mutationFn: () => applicationWorkflowService.startGeneration(applicationId),
    onSuccess: (job) => setJobId(job.id),
    onError: (error: Error) => toast.error('Could not start generation', { description: error.message }),
  })

  const job = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => applicationWorkflowService.getJob(jobId!),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'queued' || status === 'processing' ? 1500 : false
    },
  })

  if (workspace.isLoading) return <Skeleton className="h-[36rem] w-full rounded-xl" />
  if (workspace.error || !workspace.data) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Application workspace could not be loaded</AlertTitle>
        <AlertDescription>{workspace.error?.message ?? 'Application not found.'}</AlertDescription>
      </Alert>
    )
  }

  const data = workspace.data
  const extraction = data.extraction
  const conversation = data.conversation
  const opportunity = data.opportunity
  const jobComplete = job.data?.status === 'completed'

  return (
    <div className="space-y-6">
      <PageHeader
        title={data.application.title}
        description={`${data.application.organization ?? 'Personal application'} · ${data.application.state.replaceAll('_', ' ')}`}
        actions={
          <Button variant="outline" asChild>
            <Link href={ROUTES.applications}>Back to applications</Link>
          </Button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>1. Opportunity</CardTitle>
            <CardDescription>Paste the role or program details so Gemini can identify requirements.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              key={opportunity?.revision ?? 'new'}
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                const form = new FormData(event.currentTarget)
                opportunityMutation.mutate({
                  role_name: String(form.get('role_name') ?? ''),
                  organization: String(form.get('organization') ?? '') || null,
                  description: String(form.get('description') ?? ''),
                  expected_revision: opportunity?.revision ?? null,
                })
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="role-name">Role</Label>
                  <Input id="role-name" name="role_name" defaultValue={opportunity?.role_name ?? data.application.title} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input id="organization" name="organization" defaultValue={opportunity?.organization ?? data.application.organization ?? ''} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="opportunity-description">Description</Label>
                <Textarea id="opportunity-description" name="description" rows={8} defaultValue={opportunity?.description ?? data.application.opportunity_text ?? ''} required />
              </div>
              <Button type="submit" isLoading={opportunityMutation.isPending}>Analyze opportunity</Button>
            </form>
            {opportunity?.requirements.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {opportunity.requirements.slice(0, 8).map((requirement) => (
                  <Badge key={requirement.id} variant="secondary">{requirement.text}</Badge>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. CV extraction</CardTitle>
            <CardDescription>Upload a PDF, review the extracted candidate profile, then confirm it.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-dashed p-4">
              <Input type="file" accept="application/pdf,.pdf" onChange={(event) => setCv(event.target.files?.[0] ?? null)} />
              <Button className="mt-3" disabled={!cv} isLoading={uploadMutation.isPending} onClick={() => cv && uploadMutation.mutate(cv)}>
                Upload CV
              </Button>
            </div>
            {extraction ? (
              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{extraction.upload.original_filename}</span>
                  <Badge variant="outline">{extraction.status}</Badge>
                </div>
                {Object.keys(extraction.candidate_data).length ? (
                  <pre className="bg-muted max-h-48 overflow-auto rounded-md p-3 text-xs">{JSON.stringify(extraction.candidate_data, null, 2)}</pre>
                ) : null}
                {extraction.status === 'completed' ? (
                  <Button onClick={() => confirmMutation.mutate()} isLoading={confirmMutation.isPending}>Confirm extracted details</Button>
                ) : null}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Guided interview</CardTitle>
            <CardDescription>{conversation.answered_count} of {conversation.eligible_count} questions answered</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Progress value={conversation.progress_percent} />
            {conversation.is_complete ? (
              <Alert>
                <Icon name="check" size="sm" />
                <AlertTitle>Interview complete</AlertTitle>
                <AlertDescription>Your evidence is ready for document generation.</AlertDescription>
              </Alert>
            ) : conversation.current_question ? (
              <QuestionAnswer
                key={conversation.current_question.id}
                question={conversation.current_question}
                pending={answerMutation.isPending}
                onSubmit={(value) => answerMutation.mutate({ question: conversation.current_question!, value })}
              />
            ) : (
              <p className="text-muted-foreground text-sm">Complete the opportunity and CV steps to continue.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Generate and review</CardTitle>
            <CardDescription>Create the tailored CV and cover letter, then edit or export each document.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="gradient"
              onClick={() => generationMutation.mutate()}
              isLoading={generationMutation.isPending || job.data?.status === 'queued' || job.data?.status === 'processing'}
            >
              Generate documents
            </Button>
            {job.data ? (
              <Alert variant={job.data.status === 'failed' ? 'destructive' : 'default'}>
                <AlertTitle>Generation {job.data.status}</AlertTitle>
                <AlertDescription>{job.data.error_code ?? (jobComplete ? 'Your documents are ready.' : 'Gemini is preparing your documents.')}</AlertDescription>
              </Alert>
            ) : null}
            {jobComplete ? (
              <Button variant="outline" onClick={() => void refresh()}>Load documents</Button>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              {data.documents.map((document) => (
                <Button key={document.id} variant="outline" asChild className="h-auto justify-start p-4">
                  <Link href={DYNAMIC_ROUTES.document(document.id)}>
                    <Icon name={document.document_type === 'cv' ? 'resume' : 'cover-letter'} size="sm" />
                    <span className="capitalize">{document.document_type.replace('_', ' ')}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
