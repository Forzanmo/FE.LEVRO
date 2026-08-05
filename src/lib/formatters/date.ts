const MINUTE = 60_000
const HOUR = 3_600_000
const DAY = 86_400_000

/*
 * Both formatters are built once at module scope. Constructing an `Intl`
 * formatter is the expensive part — it resolves locale data — and
 * `formatRelativeTime` is called once per row per render by the applications
 * table, which re-renders on every keystroke in its search box. The absolute
 * formatter used to be constructed inside the function, so every row older than
 * a week paid for a fresh one on every pass.
 *
 * The locale is pinned to 'en' rather than left to the browser on purpose: the
 * surrounding copy is English-only, and a date reading "hace 2 horas" inside an
 * English sentence is worse than one that matches it. Revisit together with real
 * translations, not before.
 */
const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
const absoluteFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' })

/** Human relative time, e.g. "2 hours ago", "yesterday". */
export function formatRelativeTime(input: string | Date, now: Date = new Date()): string {
  const date = typeof input === 'string' ? new Date(input) : input
  const diff = date.getTime() - now.getTime()
  const abs = Math.abs(diff)

  if (abs < HOUR) return relativeFormatter.format(Math.round(diff / MINUTE), 'minute')
  if (abs < DAY) return relativeFormatter.format(Math.round(diff / HOUR), 'hour')
  if (abs < 7 * DAY) return relativeFormatter.format(Math.round(diff / DAY), 'day')

  return absoluteFormatter.format(date)
}
