'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { AnswerUpdate, OpportunityRequirementResponse, QuestionResponse } from '@/api/generated'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
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
import { analyticsService } from '@/services/api/analytics-service'

type AnswerValue = AnswerUpdate['value']

const REQUIREMENT_LABELS: Record<string, string> = {
  responsibility: 'Responsibilities',
  required_qualification: 'Required qualifications',
  preferred_qualification: 'Preferred qualifications',
  selection_criterion: 'Selection criteria',
  keyword: 'Keywords',
}

function QuestionAnswer({
  question,
  onSubmit,
  pending,
  initialValue,
}: {
  question: QuestionResponse
  onSubmit: (value: AnswerValue) => void
  pending: boolean
  initialValue?: unknown
}) {
  const [value, setValue] = useState(() =>
    Array.isArray(initialValue) ? initialValue.join(', ') : String(initialValue ?? ''),
  )

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
        <div className="flex flex-wrap items-center gap-2">
          <Label htmlFor={`answer-${question.id}`}>{question.label}</Label>
          <Badge variant="outline">{question.is_required ? 'Required' : 'Optional'}</Badge>
        </div>
        {question.help_text ? <p className="text-muted-foreground mt-1 text-sm">{question.help_text}</p> : null}
      </div>
      {options ? (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Button
              key={option}
              type="button"
              variant={value.split(',').map((item) => item.trim()).includes(option) ? 'default' : 'outline'}
              onClick={() => {
                if (question.question_type !== 'multiple_choice') {
                  setValue(option)
                  return
                }
                const selected = value.split(',').map((item) => item.trim()).filter(Boolean)
                setValue(
                  (selected.includes(option)
                    ? selected.filter((item) => item !== option)
                    : [...selected, option]
                  ).join(', '),
                )
              }}
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
          dir="auto"
        />
      ) : (
        <Input
          id={`answer-${question.id}`}
          type={question.question_type === 'number' ? 'number' : question.question_type === 'date' ? 'date' : 'text'}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          required={question.is_required}
          dir="auto"
        />
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" isLoading={pending} disabled={!value && question.is_required}>
          Save and continue
        </Button>
        {!question.is_required ? (
          <Button type="button" variant="ghost" disabled={pending} onClick={() => onSubmit(null)}>
            Skip for now
          </Button>
        ) : null}
      </div>
    </form>
  )
}

function ExtractionReview({
  extraction,
  pending,
  onConfirm,
}: {
  extraction: NonNullable<Awaited<ReturnType<typeof applicationWorkflowService.getWorkspace>>['extraction']>
  pending: boolean
  onConfirm: (data: Record<string, unknown>) => void
}) {
  const entries = Object.entries(extraction.candidate_data)
  const [draft, setDraft] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      entries.map(([key, value]) => [
        key,
        typeof value === 'string' ? value : JSON.stringify(value, null, 2),
      ]),
    ),
  )
  const parsed: Record<string, unknown> = {}
  const errors: Record<string, string> = {}

  for (const [key, original] of entries) {
    const value = draft[key] ?? ''
    if (original !== null && typeof original === 'object') {
      try {
        parsed[key] = JSON.parse(value) as unknown
      } catch {
        errors[key] = 'Correct this field’s JSON formatting.'
      }
    } else if (typeof original === 'number') {
      const number = Number(value)
      if (Number.isFinite(number)) parsed[key] = number
      else errors[key] = 'Enter a valid number.'
    } else if (typeof original === 'boolean') {
      if (value === 'true' || value === 'false') parsed[key] = value === 'true'
      else errors[key] = 'Enter true or false.'
    } else {
      parsed[key] = value
    }
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">
        Review every field before confirming. Only confirmed details become reusable source evidence.
      </p>
      {entries.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {entries.map(([key, original]) => {
            const label = key.replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase())
            const structured = original !== null && typeof original === 'object'
            return (
              <div key={key} className={structured ? 'space-y-2 sm:col-span-2' : 'space-y-2'}>
                <Label htmlFor={`extraction-${extraction.id}-${key}`}>{label}</Label>
                {structured ? (
                  <Textarea
                    id={`extraction-${extraction.id}-${key}`}
                    value={draft[key] ?? ''}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, [key]: event.target.value }))
                    }
                    rows={6}
                    spellCheck={false}
                    dir="auto"
                    aria-invalid={Boolean(errors[key])}
                  />
                ) : (
                  <Input
                    id={`extraction-${extraction.id}-${key}`}
                    value={draft[key] ?? ''}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, [key]: event.target.value }))
                    }
                    dir="auto"
                    aria-invalid={Boolean(errors[key])}
                  />
                )}
                {errors[key] ? <p className="text-destructive text-sm">{errors[key]}</p> : null}
              </div>
            )
          })}
        </div>
      ) : (
        <Alert>
          <AlertDescription>No profile fields were found. Continue with the guided interview.</AlertDescription>
        </Alert>
      )}
      <Button
        onClick={() => onConfirm(parsed)}
        isLoading={pending}
        disabled={hasErrors || !entries.length}
      >
        Confirm corrected details
      </Button>
    </div>
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
    mutationFn: (data: Record<string, unknown>) =>
      applicationWorkflowService.confirmExtraction(
        applicationId,
        workspace.data!.extraction!,
        data,
      ),
    onSuccess: () => {
      void refresh()
      toast.success('CV details confirmed')
    },
    onError: (error: Error) => toast.error('Could not confirm extraction', { description: error.message }),
  })

  const retryExtractionMutation = useMutation({
    mutationFn: () => applicationWorkflowService.retryExtraction(applicationId),
    onSuccess: () => {
      void refresh()
      toast.success('CV extraction queued again')
    },
    onError: (error: Error) =>
      toast.error('Could not retry CV extraction', { description: error.message }),
  })

  const answerMutation = useMutation({
    mutationFn: ({ question, value }: { question: QuestionResponse; value: AnswerValue }) =>
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
    onError: (error: Error) => {
      // Older API proxies sometimes replace a structured 409 response with a
      // generic 500 message. Keep the recovery action useful in that case;
      // generation is only allowed after the guided interview is complete.
      const description =
        error.message === 'Internal Server Error'
          ? 'Complete the opportunity and every required guided question, then try again.'
          : error.message
      toast.error('Could not start generation', { description })
    },
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

  useEffect(() => {
    if (job.data?.status === 'completed') {
      void queryClient.invalidateQueries({ queryKey: ['application-workspace', applicationId] })
    }
  }, [applicationId, job.data?.status, queryClient])

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
  const abandonmentStep = !opportunity
    ? 'opportunity'
    : !conversation.is_complete
      ? 'questions'
      : data.documents.length === 0
        ? 'generation'
        : 'export'
  const requirementsByType = (opportunity?.requirements ?? []).reduce<
    Record<string, OpportunityRequirementResponse[]>
  >((grouped, requirement) => {
    grouped[requirement.requirement_type] = [
      ...(grouped[requirement.requirement_type] ?? []),
      requirement,
    ]
    return grouped
  }, {})

  return (
    <div className="space-y-6">
      <PageHeader
        title={data.application.title}
        description={`${data.application.organization ?? 'Personal application'} · ${data.application.state.replaceAll('_', ' ')}`}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {data.application.application_type}
            </Badge>
            <Button variant="outline" asChild>
              <Link
                href={ROUTES.applications}
                onClick={() => {
                  if (data.application.state !== 'exported') {
                    void analyticsService.applicationAbandoned(
                      data.application.id,
                      abandonmentStep,
                    )
                  }
                }}
              >
                Back to applications
              </Link>
            </Button>
          </div>
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
              <div className="mt-5 space-y-4">
                {Object.entries(requirementsByType).map(([type, requirements]) => (
                  <div key={type}>
                    <p className="mb-2 text-sm font-medium">
                      {REQUIREMENT_LABELS[type] ?? type.replaceAll('_', ' ')}
                    </p>
                    <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
                      {requirements.map((requirement) => (
                        <li key={requirement.id}>{requirement.text}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. CV extraction</CardTitle>
            <CardDescription>Upload one PDF and confirm its details, or continue from scratch.</CardDescription>
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
                {extraction.status === 'completed' ? (
                  <ExtractionReview
                    key={`${extraction.id}-${extraction.revision}`}
                    extraction={extraction}
                    pending={confirmMutation.isPending}
                    onConfirm={(data) => confirmMutation.mutate(data)}
                  />
                ) : null}
                {extraction.status === 'failed' ? (
                  <div className="space-y-3">
                    <Alert variant="destructive">
                      <AlertTitle>CV extraction failed</AlertTitle>
                      <AlertDescription>
                        {extraction.error_code ?? 'Your PDF is still safe. Retry or continue from scratch.'}
                      </AlertDescription>
                    </Alert>
                    <Button
                      variant="outline"
                      onClick={() => retryExtractionMutation.mutate()}
                      isLoading={retryExtractionMutation.isPending}
                      leftIcon={<Icon name="refresh" size="sm" />}
                    >
                      Retry extraction
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : (
              <Alert>
                <AlertTitle>Starting from scratch?</AlertTitle>
                <AlertDescription>
                  CV upload is optional. Save the opportunity and answer the guided questions below.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Guided interview</CardTitle>
            <CardDescription>{conversation.answered_count} of {conversation.eligible_count} questions answered</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Progress value={conversation.progress_percent} />
            {conversation.answered_questions.length ? (
              <Accordion type="single" collapsible>
                {conversation.answered_questions.map((question, index) => (
                  <AccordionItem key={question.id} value={question.id}>
                    <AccordionTrigger>
                      <span className="text-left">
                        {index + 1}. {question.label}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <QuestionAnswer
                        question={question}
                        initialValue={question.answer}
                        pending={answerMutation.isPending}
                        onSubmit={(value) => answerMutation.mutate({ question, value })}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : null}
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
              disabled={!opportunity || !conversation.is_complete}
            >
              Generate documents
            </Button>
            {!opportunity || !conversation.is_complete ? (
              <p className="text-muted-foreground text-sm">
                Save the opportunity and complete all required guided questions before generation.
              </p>
            ) : null}
            {job.data ? (
              <Alert variant={job.data.status === 'failed' ? 'destructive' : 'default'}>
                <AlertTitle>Generation {job.data.status}</AlertTitle>
                <AlertDescription>
                  {job.data.error_code === 'application_not_ready'
                    ? 'Complete every required guided question before generating documents.'
                    : job.data.error_code === 'generation_failed'
                      ? 'Gemini could not complete this attempt. Retry generation after checking the provider status.'
                      : job.data.error_code ?? (jobComplete ? 'Your documents are ready.' : 'Gemini is preparing your documents.')}
                </AlertDescription>
              </Alert>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              {data.documents.map((document) => (
                <Button key={document.id} variant="outline" asChild className="h-auto justify-start p-4">
                  <Link href={DYNAMIC_ROUTES.generatedDocument(document.id)}>
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
