import type { ResumeData } from '@/lib/validators/resume-schema'

/**
 * Live resume preview — the single premium template. Rendered on a fixed "paper"
 * surface (theme-invariant primitive tokens) so it reads as a real document and
 * prints correctly in either app theme. The `resume-print` class scopes the
 * browser print/PDF export (see globals.css @media print).
 */
function bulletsFrom(highlights: string): string[] {
  return highlights
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 text-[0.7rem] font-semibold tracking-wider text-[var(--neutral-500)] uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function ResumePreview({ data }: { data: ResumeData }) {
  const contactItems = [data.email, data.phone, data.location, data.website].filter(Boolean)

  return (
    <div
      id="resume-sheet"
      className="print-sheet mx-auto w-full max-w-[46rem] rounded-lg bg-white p-8 text-[var(--neutral-900)] shadow-lg ring-1 ring-[var(--neutral-200)] sm:p-10"
    >
      <header className="border-b border-[var(--neutral-200)] pb-4">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {data.fullName || 'Your name'}
        </h1>
        <p className="mt-0.5 text-sm font-medium text-[var(--brand-600)]">
          {data.headline || 'Your headline'}
        </p>
        {contactItems.length > 0 ? (
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--neutral-500)]">
            {contactItems.map((item, i) => (
              <span key={item} className="flex items-center gap-2">
                {i > 0 ? <span aria-hidden="true">·</span> : null}
                {item}
              </span>
            ))}
          </p>
        ) : null}
      </header>

      {data.summary ? (
        <Section title="Summary">
          <p className="text-sm leading-relaxed text-[var(--neutral-700)]">{data.summary}</p>
        </Section>
      ) : null}

      {data.experience.length > 0 ? (
        <Section title="Experience">
          <div className="space-y-4">
            {data.experience.map((exp) => {
              const bullets = bulletsFrom(exp.highlights)
              return (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-sm font-semibold">
                      {exp.role || 'Role'}
                      {exp.company ? (
                        <span className="font-normal text-[var(--neutral-500)]"> · {exp.company}</span>
                      ) : null}
                    </h3>
                    {exp.period ? (
                      <span className="shrink-0 text-xs text-[var(--neutral-500)] tabular-nums">
                        {exp.period}
                      </span>
                    ) : null}
                  </div>
                  {bullets.length > 0 ? (
                    <ul className="mt-1.5 space-y-1">
                      {bullets.map((bullet, i) => (
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
              )
            })}
          </div>
        </Section>
      ) : null}

      {data.skills.length > 0 ? (
        <Section title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-[var(--neutral-100)] px-2 py-0.5 text-xs text-[var(--neutral-700)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  )
}
