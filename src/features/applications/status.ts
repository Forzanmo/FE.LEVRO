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

/*
 * Five stages, five colours that survive being seen side by side: neutral →
 * navy → teal → green → rose.
 *
 * `interview` used to be `brand` while `screening` was `info`. That was fine
 * when `info` was sky and the brand was teal. Under the navy identity `info`
 * resolves to the brand navy itself (there is no room for a second blue between
 * navy and teal — see the note in `lib/design/tokens.ts`), so those two chips
 * became the same colour in adjacent columns of the same funnel. `interview`
 * moves to the accent, which is the one remaining hue in the identity and reads
 * clearly against both its neighbours.
 */
export const STATUS_META: Record<AppStatus, StatusMeta> = {
  applied: { label: 'Applied', tone: 'bg-muted text-muted-foreground', icon: 'send' },
  screening: { label: 'Screening', tone: 'bg-info-muted text-info', icon: 'search' },
  interview: {
    label: 'Interview',
    tone: 'bg-achievement-muted text-achievement',
    icon: 'message',
  },
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
