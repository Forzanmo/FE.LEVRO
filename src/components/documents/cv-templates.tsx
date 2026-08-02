import type { ResumeData } from '@/lib/validators/resume-schema'
import type { CvTemplateId } from '@/features/documents/types'
import { cn } from '@/lib/utils'

import { SHEET_SURFACE } from './document-sheet'

/**
 * The three CV templates.
 *
 * All three render on a fixed white "paper" surface using theme-invariant
 * primitive tokens, so a CV looks the same in either app theme and prints
 * correctly. `print-sheet` scopes the browser print/PDF export (globals.css).
 *
 * They are structurally different documents, not three colour schemes:
 *   - Minimalist keeps one column and lets type hierarchy do the work.
 *   - Designer moves skills and contact into a tinted sidebar.
 *   - ATS strips every construct that machine parsers mis-read — no columns,
 *     no tinted panels, no glyph bullets, standard section headings.
 */

function bulletsFrom(highlights: string): string[] {
  return highlights
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

/* Geometry here, surface colours from the shared definition — so "what a
   document looks like" is declared once for CVs, cover letters, and the landing
   hero's product shot. See `document-sheet.tsx`. */
const SHEET = cn('print-sheet mx-auto w-full max-w-[46rem] rounded-lg shadow-lg', SHEET_SURFACE)

/* -------------------------------------------------------------------------- */
/* Minimalist                                                                 */
/* -------------------------------------------------------------------------- */

function MinimalistSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="mb-2 text-xs font-semibold tracking-wider text-[var(--neutral-600)] uppercase">
        {title}
      </h3>
      {children}
    </section>
  )
}

function MinimalistCv({ data }: { data: ResumeData }) {
  const contact = [data.email, data.phone, data.location, data.website].filter(Boolean)

  return (
    <div data-testid="cv-sheet" className={cn(SHEET, 'p-8 sm:p-10')}>
      <header className="border-b border-[var(--neutral-200)] pb-4">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          {data.fullName || 'Your name'}
        </h2>
        <p className="mt-0.5 text-sm font-medium text-[var(--brand-700)]">
          {data.headline || 'Your headline'}
        </p>
        {contact.length > 0 ? (
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--neutral-600)]">
            {/* Index keys, not the value. These are static presentational lists
                built from user text, and two fields holding the same string —
                or a CV stored with a duplicate skill — would otherwise collide
                on the key and corrupt reconciliation. Nothing here reorders.

                The separator TRAILS its item rather than leading the next one.
                Each span is one unbreakable unit, so a leading separator put the
                dot at the start of the wrapped line — "· alexrivera.dev" reads as
                a bullet point, not as a continuation. Trailing means the break
                lands after the dot instead, which is how a wrapped metadata line
                is meant to read. Four contact fields wrap on the printed sheet
                more often than not. */}
            {contact.map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                {item}
                {i < contact.length - 1 ? <span aria-hidden="true">·</span> : null}
              </span>
            ))}
          </p>
        ) : null}
      </header>

      {data.summary ? (
        <MinimalistSection title="Summary">
          <p className="text-sm leading-relaxed text-[var(--neutral-700)]">{data.summary}</p>
        </MinimalistSection>
      ) : null}

      {data.experience.length > 0 ? (
        <MinimalistSection title="Experience">
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="text-sm font-semibold">
                    {exp.role || 'Role'}
                    {exp.company ? (
                      <span className="font-normal text-[var(--neutral-600)]"> · {exp.company}</span>
                    ) : null}
                  </h4>
                  {exp.period ? (
                    <span className="shrink-0 text-xs text-[var(--neutral-600)] tabular-nums">
                      {exp.period}
                    </span>
                  ) : null}
                </div>
                {bulletsFrom(exp.highlights).length > 0 ? (
                  <ul className="mt-1.5 space-y-1">
                    {bulletsFrom(exp.highlights).map((bullet, i) => (
                      <li key={i} className="flex gap-2 text-sm text-[var(--neutral-700)]">
                        <span
                          className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--brand-500)]"
                          aria-hidden="true"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </MinimalistSection>
      ) : null}

      {data.skills.length > 0 ? (
        <MinimalistSection title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((skill, i) => (
              <span
                key={i}
                className="rounded-md bg-[var(--neutral-100)] px-2 py-0.5 text-xs text-[var(--neutral-700)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </MinimalistSection>
      ) : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Designer                                                                   */
/* -------------------------------------------------------------------------- */

function DesignerCv({ data }: { data: ResumeData }) {
  const contact = [data.email, data.phone, data.location, data.website].filter(Boolean)

  return (
    <div data-testid="cv-sheet" className={cn(SHEET, 'overflow-hidden')}>
      <div className="grid sm:grid-cols-[13rem_1fr]">
        {/* Tinted sidebar — the move that defines this template, and the reason
            it is not the safe default for machine-screened applications. */}
        {/*
         * A <div>, not an <aside>. This is a column inside a document, not a
         * complementary region of the page — and as an <aside> it became a
         * second unnamed `complementary` landmark alongside the app shell's real
         * sidebar, which axe flags as `landmark-unique` because a screen-reader
         * user navigating by landmark cannot tell the two apart.
         *
         * Colour comes from the committed-surface role, so this sidebar, the
         * marketing hero, and the CTA band change in one place.
         */}
        <div className="bg-brand-surface text-brand-surface-foreground p-6 sm:p-7">
          <h2 className="font-heading text-xl leading-tight font-semibold tracking-tight text-balance">
            {data.fullName || 'Your name'}
          </h2>
          <p className="mt-1 text-sm text-white/85">{data.headline || 'Your headline'}</p>

          {contact.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-xs font-semibold tracking-wider text-white/75 uppercase">
                Contact
              </h3>
              <ul className="mt-2 space-y-1.5">
                {contact.map((item, i) => (
                  <li key={i} className="text-xs leading-relaxed text-white/90">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {data.skills.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-xs font-semibold tracking-wider text-white/75 uppercase">
                Skills
              </h3>
              <ul className="mt-2 space-y-1.5">
                {data.skills.map((skill, i) => (
                  <li key={i} className="text-xs text-white/90">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {/* `min-w-0`: a grid item defaults to `min-width: auto`, so without it
            this column is never allowed to be narrower than its content. */}
        <div className="min-w-0 p-7 sm:p-8">
          {data.summary ? (
            <section>
              <h3 className="font-heading text-sm font-semibold tracking-tight">Profile</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--neutral-700)]">
                {data.summary}
              </p>
            </section>
          ) : null}

          {data.experience.length > 0 ? (
            <section className="mt-6">
              <h3 className="font-heading text-sm font-semibold tracking-tight">Experience</h3>
              <div className="mt-3 space-y-5">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="relative pl-4">
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 left-0 size-1.5 rounded-full bg-[var(--brand-500)]"
                    />
                    <h4 className="text-sm font-semibold">{exp.role || 'Role'}</h4>
                    <p className="text-xs text-[var(--neutral-600)]">
                      {exp.company}
                      {exp.company && exp.period ? ' · ' : ''}
                      <span className="tabular-nums">{exp.period}</span>
                    </p>
                    {bulletsFrom(exp.highlights).length > 0 ? (
                      <ul className="mt-1.5 space-y-1">
                        {bulletsFrom(exp.highlights).map((bullet, i) => (
                          <li key={i} className="text-sm text-[var(--neutral-700)]">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* ATS                                                                        */
/* -------------------------------------------------------------------------- */

function AtsCv({ data }: { data: ResumeData }) {
  const contact = [data.email, data.phone, data.location, data.website].filter(Boolean)

  return (
    /*
     * Deliberately plain. No columns, no tinted panels, no glyph bullets, no
     * decorative dots — every one of those is a construct that applicant
     * tracking systems routinely mis-order or drop, and a candidate never finds
     * out that it happened. Section headings use the exact words parsers look
     * for ("Professional Experience", "Skills"), and hyphens are used as list
     * markers because they survive plain-text extraction.
     */
    <div data-testid="cv-sheet" className={cn(SHEET, 'p-8 sm:p-10')}>
      <header>
        <h2 className="text-xl font-bold">{data.fullName || 'Your name'}</h2>
        <p className="text-sm">{data.headline || 'Your headline'}</p>
        {contact.length > 0 ? <p className="mt-1 text-sm">{contact.join(' | ')}</p> : null}
      </header>

      {data.summary ? (
        <section className="mt-5">
          <h3 className="text-sm font-bold uppercase">Summary</h3>
          <p className="mt-1 text-sm leading-relaxed">{data.summary}</p>
        </section>
      ) : null}

      {data.experience.length > 0 ? (
        <section className="mt-5">
          <h3 className="text-sm font-bold uppercase">Professional Experience</h3>
          <div className="mt-1 space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <p className="text-sm font-bold">
                  {exp.role}
                  {exp.company ? `, ${exp.company}` : ''}
                </p>
                {exp.period ? <p className="text-sm">{exp.period}</p> : null}
                {bulletsFrom(exp.highlights).length > 0 ? (
                  <ul className="mt-1">
                    {bulletsFrom(exp.highlights).map((bullet, i) => (
                      <li key={i} className="text-sm leading-relaxed">
                        - {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {data.skills.length > 0 ? (
        <section className="mt-5">
          <h3 className="text-sm font-bold uppercase">Skills</h3>
          <p className="mt-1 text-sm">{data.skills.join(', ')}</p>
        </section>
      ) : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */

export function CvTemplate({ template, data }: { template: CvTemplateId; data: ResumeData }) {
  if (template === 'designer') return <DesignerCv data={data} />
  if (template === 'ats') return <AtsCv data={data} />
  return <MinimalistCv data={data} />
}
