'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type {
  AdminQuestionInput,
  QuestionRuleAnswerEquals,
  QuestionRuleApplicationType,
  QuestionSetVersionResponse,
  QuestionType,
} from '@/api/generated'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Icon } from '@/components/ui/icon'
import { PageHeader } from '@/components/shared/page-header'
import { ROUTES } from '@/lib/constants/routes'
import { adminService } from '@/services/api/admin-service'

const QUESTION_TYPES: QuestionType[] = [
  'short_text',
  'long_text',
  'number',
  'date',
  'single_choice',
  'multiple_choice',
  'yes_no',
]
const PROFILE_SECTIONS: NonNullable<AdminQuestionInput['profile_section']>[] = [
  'general', 'contact', 'education', 'experience', 'projects', 'skills',
  'certifications', 'activities', 'languages', 'links',
]

type Rule = QuestionRuleApplicationType | QuestionRuleAnswerEquals | null
type EditableQuestion = AdminQuestionInput & { localId: string; ruleJson: string }

function editableQuestions(version: QuestionSetVersionResponse): EditableQuestion[] {
  return version.questions.map((question) => ({
    display_order: question.display_order,
    help_text: question.help_text,
    is_active: question.is_active,
    is_required: question.is_required,
    key: question.key,
    label: question.label,
    options: question.options,
    profile_section: question.profile_section,
    question_type: question.question_type,
    rule: question.rule,
    localId: question.id,
    ruleJson: question.rule ? JSON.stringify(question.rule, null, 2) : '',
  }))
}

function QuestionSetEditor({ version }: { version: QuestionSetVersionResponse }) {
  const queryClient = useQueryClient()
  const [questions, setQuestions] = useState<EditableQuestion[]>(() => editableQuestions(version))

  const update = (localId: string, patch: Partial<EditableQuestion>) => {
    setQuestions((current) => current.map((question) => question.localId === localId ? { ...question, ...patch } : question))
  }

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= questions.length) return
    setQuestions((current) => {
      const next = [...current]
      ;[next[index], next[target]] = [next[target]!, next[index]!]
      return next.map((question, order) => ({ ...question, display_order: order }))
    })
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = questions.map(({ localId: _localId, ruleJson, ...question }, index) => {
        let rule: Rule = null
        if (ruleJson.trim()) {
          const parsed = JSON.parse(ruleJson) as unknown
          if (!parsed || typeof parsed !== 'object' || !('operator' in parsed)) {
            throw new Error(`Rule for “${question.label}” must be a valid rule object.`)
          }
          rule = parsed as Rule
        }
        return { ...question, display_order: index, rule }
      })
      return adminService.replaceQuestions(version.id, version.revision, payload)
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['admin-question-set', version.id], updated)
      toast.success('Question set saved')
    },
    onError: (error: Error) => toast.error('Could not save question set', { description: error.message }),
  })

  const addQuestion = () => {
    const number = questions.length + 1
    setQuestions((current) => [
      ...current,
      {
        localId: crypto.randomUUID(),
        key: `question_${number}`,
        label: `Question ${number}`,
        question_type: 'short_text',
        profile_section: 'general',
        display_order: current.length,
        is_required: true,
        is_active: true,
        help_text: null,
        options: null,
        rule: null,
        ruleJson: '',
      },
    ])
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <Card key={question.localId}>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Question {index + 1}</CardTitle>
                <CardDescription>{question.key}</CardDescription>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon-sm" aria-label="Move question up" disabled={index === 0} onClick={() => move(index, -1)}><Icon name="chevron-up" size="sm" /></Button>
                <Button variant="ghost" size="icon-sm" aria-label="Move question down" disabled={index === questions.length - 1} onClick={() => move(index, 1)}><Icon name="chevron-down" size="sm" /></Button>
                <Button variant="ghost" size="icon-sm" aria-label="Remove question" className="text-destructive" onClick={() => setQuestions((current) => current.filter((item) => item.localId !== question.localId))}><Icon name="delete" size="sm" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Stable key</Label><Input value={question.key} onChange={(event) => update(question.localId, { key: event.target.value })} /></div>
              <div className="space-y-2"><Label>Label</Label><Input value={question.label} onChange={(event) => update(question.localId, { label: event.target.value })} /></div>
              <div className="space-y-2">
                <Label>Question type</Label>
                <Select value={question.question_type} onValueChange={(value) => update(question.localId, { question_type: value as QuestionType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{QUESTION_TYPES.map((type) => <SelectItem key={type} value={type}>{type.replaceAll('_', ' ')}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Profile section</Label>
                <Select value={question.profile_section} onValueChange={(value) => update(question.localId, { profile_section: value as NonNullable<AdminQuestionInput['profile_section']> })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PROFILE_SECTIONS.map((section) => <SelectItem key={section} value={section}>{section}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Help text</Label><Textarea value={question.help_text ?? ''} onChange={(event) => update(question.localId, { help_text: event.target.value || null })} /></div>
            {question.question_type === 'single_choice' || question.question_type === 'multiple_choice' ? (
              <div className="space-y-2"><Label>Options</Label><Input value={question.options?.join(', ') ?? ''} placeholder="Option one, Option two" onChange={(event) => update(question.localId, { options: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })} /></div>
            ) : null}
            <div className="space-y-2">
              <Label>Conditional rule (JSON, optional)</Label>
              <Textarea
                value={question.ruleJson}
                onChange={(event) => update(question.localId, { ruleJson: event.target.value })}
                placeholder={'{"operator":"application_type_in","values":["job"]}'}
                className="font-mono text-xs"
              />
            </div>
            <div className="flex flex-wrap gap-6">
              <Label className="flex items-center gap-2"><Switch checked={question.is_required} onCheckedChange={(checked) => update(question.localId, { is_required: checked })} />Required</Label>
              <Label className="flex items-center gap-2"><Switch checked={question.is_active} onCheckedChange={(checked) => update(question.localId, { is_active: checked })} />Active</Label>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex flex-wrap justify-between gap-3">
        <Button variant="outline" onClick={addQuestion} leftIcon={<Icon name="add" size="sm" />}>Add question</Button>
        <Button onClick={() => saveMutation.mutate()} isLoading={saveMutation.isPending} disabled={version.is_published}>Save all questions</Button>
      </div>
    </div>
  )
}

export function AdminQuestionSetView({ versionId }: { versionId: string }) {
  const queryClient = useQueryClient()
  const version = useQuery({ queryKey: ['admin-question-set', versionId], queryFn: () => adminService.getVersion(versionId) })
  const publishMutation = useMutation({
    mutationFn: () => adminService.publishVersion(versionId),
    onSuccess: (updated) => {
      queryClient.setQueryData(['admin-question-set', versionId], updated)
      void queryClient.invalidateQueries({ queryKey: ['admin-overview'] })
      toast.success('Question set published')
    },
    onError: (error: Error) => toast.error('Could not publish question set', { description: error.message }),
  })

  if (version.isLoading) return <Skeleton className="h-[42rem] w-full rounded-xl" />
  if (version.error || !version.data) {
    return <Alert variant="destructive"><AlertTitle>Question set could not be loaded</AlertTitle><AlertDescription>{version.error?.message ?? 'Not found.'}</AlertDescription></Alert>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={version.data.name}
        description={`Version ${version.data.version} · revision ${version.data.revision}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link href={ROUTES.admin}>Back to admin</Link></Button>
            <Button
              variant="gradient"
              disabled={version.data.is_published || version.data.questions.length === 0}
              isLoading={publishMutation.isPending}
              onClick={() => {
                if (window.confirm('Publish this version? Published question sets cannot be edited.')) {
                  publishMutation.mutate()
                }
              }}
            >
              {version.data.is_published ? 'Published' : 'Publish version'}
            </Button>
          </div>
        }
      />
      {version.data.is_published ? (
        <Alert><Icon name="lock" size="sm" /><AlertTitle>Published and immutable</AlertTitle><AlertDescription>Clone this version from the admin overview to make changes safely.</AlertDescription></Alert>
      ) : null}
      <QuestionSetEditor key={version.data.revision} version={version.data} />
    </div>
  )
}
