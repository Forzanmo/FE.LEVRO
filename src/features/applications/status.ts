import type { IconName } from '@/components/ui/icon'

export const APPLICATION_STATUSES = [
  'applied',
  'screening',
  'interview',
  'offer',
  'rejected',
] as const

export type AppStatus = (typeof APPLICATION_STATUSES)[number]

export interface StatusMeta {
  label: string
  /** Badge surface + text classes. */
  tone: string
  icon: IconName
}

export const STATUS_META: Record<AppStatus, StatusMeta> = {
  applied: { label: 'Applied', tone: 'bg-muted text-muted-foreground', icon: 'send' },
  screening: { label: 'Screening', tone: 'bg-info-muted text-info', icon: 'search' },
  interview: { label: 'Interview', tone: 'bg-brand-muted text-brand', icon: 'message' },
  offer: { label: 'Offer', tone: 'bg-success-muted text-success', icon: 'achievements' },
  rejected: { label: 'Rejected', tone: 'bg-destructive-muted text-destructive', icon: 'close' },
}

/*
 * `PIPELINE_STAGES` (applied/screening/interview/offer, excluding 'rejected')
 * lived here and is deliberately gone. The summary divided by a total that
 * included rejections while listing only the four stages that didn't, so its
 * counts never reconciled with the table beneath it and a user's rejections
 * disappeared from their own numbers. The funnel order now lives in
 * `pipeline-summary.tsx`, includes every status exactly once, and is the only
 * place that decides stage order.
 */
