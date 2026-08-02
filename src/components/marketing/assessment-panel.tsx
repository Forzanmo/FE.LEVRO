import { SHEET_INK, SHEET_SURFACE } from '@/components/documents/document-sheet'
import { cn } from '@/lib/utils'

/**
 * The hero's product visualization: Levvro's skills assessment, mid-run.
 *
 * This is the one artefact that answers all three hero questions without being
 * read — what this is (a report on your CV), who it is for (someone chasing a
 * named role), and why it is different (every verdict carries the line of your
 * own CV that earned it). A generic dashboard screenshot answers none of them.
 *
 * It renders on the shared document sheet rather than as a dark glass panel,
 * because DESIGN.md's Paper Rule names this exact surface — "the landing hero's
 * product shot" — and because a white report on a dark desk is the clearest
 * possible reading of "here is what we hand you".
 *
 * Nothing here is a lie the product cannot back: the verdicts are the three the
 * dashboard actually issues, the reasoning line is the shape of evidence the
 * coach collects, and the counts reconcile. Inventing a "94% match score" would
 * be the exact assertion-over-evidence the product exists to argue against.
 *
 * Server-rendered, no JS. The one-shot resolve animation is CSS whose default
 * state is "already resolved" — see the panel keyframes in globals.css.
 */

type Verdict = 'evidenced' | 'thin' | 'absent'

const VERDICT: Record<Verdict, { label: string; chip: string; dot: string }> = {
  /*
   * Outlined, not filled — DESIGN.md's Filled-Is-Earned Corollary. The whole
   * strength set reads as one taxonomy, and a warm "Thin" chip can never be
   * mistaken for a completion badge.
   */
  evidenced: {
    label: 'Evidenced',
    chip: 'border-[var(--accent-700)]/45 text-[var(--accent-700)]',
    dot: 'bg-[var(--accent-600)]',
  },
  thin: {
    label: 'Thin',
    chip: 'border-[var(--warning-700)]/45 text-[var(--warning-700)]',
    dot: 'bg-[var(--warning-500)]',
  },
  absent: {
    label: 'Not shown',
    chip: 'border-[var(--neutral-300)] text-[var(--neutral-600)]',
    dot: 'bg-[var(--neutral-300)]',
  },
}

const EVIDENCED_COUNT = 7
const TOTAL_COUNT = 11

/*
 * The worked example is deliberately NOT a software engineer.
 *
 * The eyebrow beside this panel says "For juniors and career shifters", and the
 * panel is the artefact that answers "what is this" before anyone reads a word.
 * When it listed React, TypeScript and system design it answered "this is for
 * software engineers", and a shifter moving into marketing, ops or teaching had
 * their question answered wrongly in the first second. That the team building it
 * did not notice is the point: they are the sample.
 */
const ROWS: { skill: string; verdict: Verdict; evidence?: string }[] = [
  {
    skill: 'Campaign reporting',
    verdict: 'evidenced',
    evidence: '“Owned the weekly performance report for six campaigns” — Experience, line 2',
  },
  { skill: 'Stakeholder communication', verdict: 'evidenced' },
  { skill: 'Budget ownership', verdict: 'thin' },
]

/** The row that resolves on load — the product thinking, made visible. */
const RESOLVING = { skill: 'Paid media strategy', verdict: 'absent' as const }

function VerdictChip({ verdict }: { verdict: Verdict }) {
  const meta = VERDICT[verdict]
  return (
    <span
      className={cn(
        'shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        meta.chip,
      )}
    >
      {meta.label}
    </span>
  )
}

export function AssessmentPanel({ className }: { className?: string }) {
  return (
    <div className={cn('relative', className)}>
      {/*
       * The CV peeking out behind — the thing the assessment produces. A single
       * offset edge, not a fanned stack: the story is "report, then document",
       * and a third card would just be decoration.
       *
       * `hidden sm:block`: on a phone the offset sheet steals horizontal space
       * the panel needs and reads as a rendering glitch at 320px.
       */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute -top-3 -right-3 hidden h-full w-full rounded-2xl sm:block',
          'rotate-[1.6deg] bg-white/85 ring-1 ring-white/25',
        )}
      />

      <div
        className={cn(
          'relative rounded-2xl p-5 shadow-xl sm:p-6',
          // The panel is a document, so it uses the shared theme-invariant sheet
          // rather than `card` — it must look the same in both themes, like the
          // CV it describes.
          SHEET_SURFACE,
        )}
      >
        {/* Header — what is being assessed, and against what. */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={cn('text-sm font-semibold', SHEET_INK.heading)}>Skills assessment</p>
            <p className={cn('mt-0.5 truncate text-xs', SHEET_INK.muted)}>
              Target role · Marketing Coordinator
            </p>
          </div>
          {/*
           * "Example", not "Live".
           *
           * The chip used to read Live beside a pulsing dot, on a hard-coded
           * 7 / 11 — a perpetual liveness indicator on a static mock. On the one
           * page whose entire argument is evidence over assertion, an unlabelled
           * fabricated assessment of a fictional person was the weakest thing
           * here. Naming it costs nothing and is the only version of this panel
           * consistent with what it is selling.
           */}
          <span
            className={cn(
              'shrink-0 rounded-full px-2 py-1 text-xs font-medium',
              SHEET_INK.chip,
            )}
          >
            Example
          </span>
        </div>

        {/* Coverage — the headline number, and a meter that reconciles with it. */}
        <div className={cn('mt-5 border-t pt-4', SHEET_INK.hairline)}>
          <div className="flex items-baseline justify-between gap-3">
            <p className={cn('text-xs font-medium', SHEET_INK.body)}>Skills your CV proves</p>
            <p className={cn('text-xs tabular-nums', SHEET_INK.muted)}>
              <span className={cn('text-sm font-semibold', SHEET_INK.heading)}>
                {EVIDENCED_COUNT}
              </span>
              {' / '}
              {TOTAL_COUNT}
            </p>
          </div>

          {/*
           * A segmented meter, not a smooth bar: the underlying quantity is a
           * count of discrete skills, and a continuous bar would imply a
           * precision the assessment does not claim. Eleven segments, seven lit.
           */}
          <div className="mt-2.5 flex gap-1" role="img" aria-label="7 of 11 skills evidenced">
            {Array.from({ length: TOTAL_COUNT }, (_, i) => (
              <span
                key={i}
                className={cn(
                  'meter-segment h-1.5 flex-1 rounded-full',
                  i < EVIDENCED_COUNT ? 'bg-[var(--accent-600)]' : 'bg-[var(--neutral-200)]',
                )}
                style={{ animationDelay: `${i * 55}ms` }}
              />
            ))}
          </div>
        </div>

        {/* The verdicts. */}
        <ul className={cn('mt-4 divide-y border-t', SHEET_INK.hairline)}>
          {ROWS.map((row) => (
            <li key={row.skill} className={cn('py-2.5', SHEET_INK.hairline)}>
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={cn('size-1.5 shrink-0 rounded-full', VERDICT[row.verdict].dot)}
                  />
                  {/* Wraps rather than truncates. At 320px the verdict chip
                      takes ~72px of a 240px row, and the skill name IS the row —
                      "React & component arc…" tells the reader nothing. */}
                  <span className={cn('line-clamp-2 text-sm', SHEET_INK.body)}>
                    {row.skill}
                  </span>
                </span>
                <VerdictChip verdict={row.verdict} />
              </div>

              {/*
               * The reasoning. This single line is the product's entire claim —
               * every other tool asserts a score, Levvro quotes the sentence
               * that earned the verdict — so it is shown by default rather than
               * hidden behind the disclosure the dashboard uses.
               */}
              {row.evidence ? (
                <p
                  className={cn('mt-1.5 ml-4 text-xs leading-relaxed', SHEET_INK.muted)}
                >
                  {row.evidence}
                </p>
              ) : null}
            </li>
          ))}

          {/*
           * The resolving row. Both states are always in the DOM and both
           * default to their finished appearance, so the panel is correct with
           * no animation at all; the keyframes only replay how it got there.
           */}
          <li className={cn('relative py-2.5', SHEET_INK.hairline)}>
            <div className="panel-verdict flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={cn('size-1.5 shrink-0 rounded-full', VERDICT[RESOLVING.verdict].dot)}
                />
                <span className={cn('line-clamp-2 text-sm', SHEET_INK.body)}>
                  {RESOLVING.skill}
                </span>
              </span>
              <VerdictChip verdict={RESOLVING.verdict} />
            </div>

            {/*
             * `bg-white`, not a bare overlay. This layer sits on top of the
             * resolved row, so without an opaque background its text composites
             * over the text underneath — axe reported that as a serious
             * colour-contrast violation on three renders, and it was right: two
             * overlapping strings have no determinate contrast even while one is
             * fading. An opaque backing also makes the crossfade read as one row
             * changing rather than two rows briefly showing through each other.
             */}
            <div
              aria-hidden="true"
              className="panel-pending absolute inset-0 flex items-center gap-2.5 bg-white"
            >
              <span className="panel-pending-dot size-1.5 shrink-0 rounded-full bg-[var(--accent-600)]" />
              <span className={cn('text-sm', SHEET_INK.muted)}>Reading your experience…</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}
