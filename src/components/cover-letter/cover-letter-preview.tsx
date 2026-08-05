import { SHEET_SURFACE } from '@/components/documents/document-sheet'
import { Icon } from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { Text } from '@/components/ui/typography'
import type { CoverLetter } from '@/features/cover-letter/types'
import { cn } from '@/lib/utils'

// Surface colours from the one shared definition; geometry and padding local.
const SHEET_CLASS = cn(
  'print-sheet mx-auto w-full max-w-[46rem] rounded-lg p-8 shadow-lg sm:p-10',
  SHEET_SURFACE,
)

export function CoverLetterPreview({
  letter,
  isGenerating,
}: {
  letter: CoverLetter | null
  isGenerating: boolean
}) {
  if (isGenerating) {
    return (
      <div className={SHEET_CLASS}>
        <Skeleton className="h-4 w-40" />
        <div className="mt-6 space-y-2.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className={i % 3 === 2 ? 'h-3.5 w-2/3' : 'h-3.5 w-full'} />
          ))}
        </div>
      </div>
    )
  }

  if (!letter) {
    return (
      // Taller on desktop so the placeholder occupies roughly the space the
      // letter will. At 24rem the page ended around y=565 on a 1440×900
      // viewport and about 65% of the screen was blank, which read as broken
      // rather than as waiting.
      <div className="flex min-h-[24rem] flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center lg:min-h-[34rem]">
        <span className="bg-brand-muted text-brand grid size-12 place-items-center rounded-full">
          <Icon name="cover-letter" size="lg" />
        </span>
        <div className="space-y-1">
          <Text weight="medium">Your letter will appear here</Text>
          <Text tone="muted" size="sm" className="mx-auto max-w-xs">
            Add the company and role, pick a tone, then generate.
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div id="cover-letter-sheet" className={SHEET_CLASS}>
      <p className="text-sm">{letter.greeting}</p>
      <div className="mt-4 space-y-4">
        {letter.paragraphs.map((paragraph, i) => (
          <p key={i} className="text-sm leading-relaxed text-[var(--neutral-700)]">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="mt-6 text-sm">
        <p>{letter.signoff}</p>
        <p className="mt-4 font-medium">{letter.name}</p>
      </div>
    </div>
  )
}
