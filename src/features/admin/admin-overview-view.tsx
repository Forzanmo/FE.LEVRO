'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/shared/page-header'
import { DYNAMIC_ROUTES } from '@/lib/constants/routes'
import { adminService } from '@/services/api/admin-service'

const number = new Intl.NumberFormat('en-US')
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 4 })

function MetricCard({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground text-xs">{description}</CardContent>
    </Card>
  )
}

export function AdminOverviewView() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [days, setDays] = useState('30')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const overviewKey = ['admin-overview', Number(days)] as const
  const overview = useQuery({ queryKey: overviewKey, queryFn: () => adminService.getOverview(Number(days)) })
  const users = useQuery({ queryKey: ['admin-users'], queryFn: () => adminService.listUsers() })
  const activeUserId = selectedUserId ?? users.data?.users[0]?.id ?? null
  const journey = useQuery({
    queryKey: ['admin-user-journey', activeUserId],
    queryFn: () => adminService.getUserJourney(activeUserId as string),
    enabled: activeUserId !== null,
  })

  const createMutation = useMutation({
    mutationFn: ({ name, cloneFrom }: { name: string; cloneFrom?: string }) =>
      adminService.createVersion({ name, clone_from_version_id: cloneFrom || null }),
    onSuccess: (version) => {
      void queryClient.invalidateQueries({ queryKey: ['admin-overview'] })
      router.push(DYNAMIC_ROUTES.adminQuestionSet(version.id))
    },
    onError: (error: Error) => toast.error('Could not create question set', { description: error.message }),
  })

  if (overview.isLoading) return <Skeleton className="h-[38rem] w-full rounded-xl" />
  if (overview.error || !overview.data) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Admin data could not be loaded</AlertTitle>
        <AlertDescription>{overview.error?.message ?? 'You may not have admin access.'}</AlertDescription>
      </Alert>
    )
  }

  const data = overview.data
  const ai = data.aiUsage.buckets.reduce(
    (total, bucket) => ({
      calls: total.calls + bucket.invocation_count,
      tokens: total.tokens + bucket.total_tokens,
      failures: total.failures + bucket.failure_count,
      cost: total.cost + bucket.estimated_cost_microusd,
    }),
    { calls: 0, tokens: 0, failures: 0, cost: 0 },
  )
  const delivered = data.emailDelivery.buckets
    .filter((bucket) => bucket.status === 'delivered')
    .reduce((sum, bucket) => sum + bucket.delivery_count, 0)
  const started = data.productFunnel.buckets.find((bucket) => bucket.event_name === 'application_started')?.distinct_applications ?? 0
  const exported = data.productFunnel.buckets
    .filter((bucket) => bucket.event_name === 'cv_exported' || bucket.event_name === 'cover_letter_exported')
    .reduce((sum, bucket) => sum + bucket.distinct_applications, 0)

  const create = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    createMutation.mutate({
      name: String(form.get('name') ?? ''),
      cloneFrom: String(form.get('clone_from') ?? ''),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin panel"
        description="Manage guided questions and monitor production operations."
        actions={
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="AI calls" value={number.format(ai.calls)} description={`${number.format(ai.tokens)} tokens · ${ai.failures} failed`} />
        <MetricCard label="Estimated AI cost" value={money.format(ai.cost / 1_000_000)} description="Provider-recorded estimated cost" />
        <MetricCard label="Emails delivered" value={number.format(delivered)} description={`${data.emailDelivery.overdue_count} overdue in the outbox`} />
        <MetricCard label="Application funnel" value={`${started} → ${exported}`} description="Started applications to document exports" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card>
          <CardHeader>
            <CardTitle>Question set versions</CardTitle>
            <CardDescription>Only a published version is used by new guided interviews.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {data.versions.map((version) => (
                <Link
                  key={version.id}
                  href={DYNAMIC_ROUTES.adminQuestionSet(version.id)}
                  className="hover:bg-muted/50 flex items-center justify-between gap-4 rounded-lg px-3 py-3 transition"
                >
                  <div>
                    <div className="font-medium">{version.name}</div>
                    <div className="text-muted-foreground text-xs">Version {version.version} · {version.questions.length} questions · revision {version.revision}</div>
                  </div>
                  <Badge variant={version.is_published ? 'default' : 'outline'}>{version.is_published ? 'Published' : 'Draft'}</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create version</CardTitle>
            <CardDescription>Start empty or clone an existing question set.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={create}>
              <div className="space-y-2">
                <Label htmlFor="version-name">Name</Label>
                <Input id="version-name" name="name" placeholder="September guided flow" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clone-version">Clone from</Label>
                <select id="clone-version" name="clone_from" className="border-input bg-background h-9 w-full rounded-lg border px-3 text-sm">
                  <option value="">Start empty</option>
                  {data.versions.map((version) => <option key={version.id} value={version.id}>{version.name} v{version.version}</option>)}
                </select>
              </div>
              <Button type="submit" fullWidth isLoading={createMutation.isPending}>Create draft</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>AI usage by model</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.aiUsage.buckets.map((bucket) => (
              <div key={`${bucket.provider}-${bucket.model}`} className="flex justify-between gap-3 text-sm"><span>{bucket.provider} · {bucket.model}</span><span className="text-muted-foreground">{number.format(bucket.invocation_count)} calls</span></div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Email delivery</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.emailDelivery.buckets.map((bucket) => (
              <div key={`${bucket.email_type}-${bucket.status}`} className="flex justify-between gap-3 text-sm"><span>{bucket.email_type} · {bucket.status}</span><span className="text-muted-foreground">{number.format(bucket.delivery_count)}</span></div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Product funnel events</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.productFunnel.buckets.map((bucket) => (
              <div key={bucket.event_name} className="flex justify-between gap-3 text-sm"><span>{bucket.event_name.replaceAll('_', ' ')}</span><span className="text-muted-foreground">{number.format(bucket.event_count)}</span></div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User journey preview</CardTitle>
          <CardDescription>
            Select a user to inspect safe progress milestones without exposing CV text, answers, or
            private files.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {users.isLoading ? <Skeleton className="h-20 w-full" /> : null}
          {users.error ? (
            <Alert variant="destructive">
              <AlertDescription>{users.error.message}</AlertDescription>
            </Alert>
          ) : null}
          {users.data?.users.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {users.data.users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelectedUserId(user.id)}
                  className={`rounded-lg border p-3 text-left transition hover:border-brand ${activeUserId === user.id ? 'border-brand bg-brand/5' : ''}`}
                >
                  <div className="font-medium">{user.full_name ?? user.email}</div>
                  <div className="text-muted-foreground text-xs">{user.email}</div>
                  <div className="text-muted-foreground mt-2 text-xs">
                    {user.application_count} applications · {user.document_count} documents
                  </div>
                </button>
              ))}
            </div>
          ) : null}
          {journey.isLoading ? <Skeleton className="h-32 w-full" /> : null}
          {journey.data ? (
            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-semibold">{journey.data.user.full_name ?? journey.data.user.email}</div>
                  <div className="text-muted-foreground text-xs">{journey.data.user.email}</div>
                </div>
                <Badge>{journey.data.profile_fields} profile fields</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {journey.data.events.map((event) => <Badge key={event} variant="outline">{event.replaceAll('_', ' ')}</Badge>)}
              </div>
              {journey.data.applications.length ? (
                <div className="space-y-2">
                  {journey.data.applications.map((application) => (
                    <div key={application.id} className="rounded-md bg-muted/50 p-3 text-sm">
                      <div className="flex flex-wrap justify-between gap-2 font-medium">
                        <span>{application.title}</span>
                        <Badge variant="outline">{application.state}</Badge>
                      </div>
                      <div className="text-muted-foreground mt-1 text-xs">
                        {application.has_opportunity ? 'Opportunity saved' : 'Opportunity missing'} · {application.answered_questions}/{application.question_count} questions · {application.document_types.length} documents · {application.export_count} exports
                      </div>
                    </div>
                  ))}
                </div>
              ) : <div className="text-muted-foreground text-sm">No applications yet.</div>}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
