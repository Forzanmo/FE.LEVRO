import { cn } from '@/lib/utils'

/** Slim assessment progress: filled/active/upcoming pips + a count. */
export function CoachProgress({ index, total }: { index: number; total: number }) {
  return (
    <div
      className="flex items-center gap-3"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={Math.min(index, total)}
      aria-label="Assessment progress"
    >
      <div className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300 ease-[var(--ease-emphasized)]',
              i < index ? 'bg-brand w-4' : i === index ? 'bg-brand/50 w-4' : 'bg-muted w-1.5',
            )}
          />
        ))}
      </div>
      <span className="text-muted-foreground text-xs font-medium tabular-nums">
        {Math.min(index + 1, total)}/{total}
      </span>
    </div>
  )
}
