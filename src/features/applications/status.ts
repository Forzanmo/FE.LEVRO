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

/** Ordered pipeline stages used by the funnel summary (excludes 'rejected'). */
export const PIPELINE_STAGES: AppStatus[] = ['applied', 'screening', 'interview', 'offer']
