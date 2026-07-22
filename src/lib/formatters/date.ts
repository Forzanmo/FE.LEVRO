const MINUTE = 60_000
const HOUR = 3_600_000
const DAY = 86_400_000

const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

/** Human relative time, e.g. "2 hours ago", "yesterday". */
export function formatRelativeTime(input: string | Date, now: Date = new Date()): string {
  const date = typeof input === 'string' ? new Date(input) : input
  const diff = date.getTime() - now.getTime()
  const abs = Math.abs(diff)

  if (abs < HOUR) return relativeFormatter.format(Math.round(diff / MINUTE), 'minute')
  if (abs < DAY) return relativeFormatter.format(Math.round(diff / HOUR), 'hour')
  if (abs < 7 * DAY) return relativeFormatter.format(Math.round(diff / DAY), 'day')

  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date)
}
