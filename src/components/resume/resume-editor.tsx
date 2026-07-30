'use client'

import { useFieldArray, type UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/field'
import { Icon } from '@/components/ui/icon'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Heading, Text } from '@/components/ui/typography'
import { RESUME_LIMITS, type ResumeData } from '@/lib/validators/resume-schema'

import { SkillsInput } from './skills-input'

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-card ring-foreground/10 rounded-xl p-5 ring-1">
      <div className="mb-4">
        <Heading level={2} size="lg">
          {title}
        </Heading>
        {description ? (
          <Text tone="muted" size="sm" className="mt-0.5">
            {description}
          </Text>
        ) : null}
      </div>
      {children}
    </section>
  )
}

export function ResumeEditor({ form }: { form: UseFormReturn<ResumeData> }) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form
  const { fields, append, remove } = useFieldArray({ control, name: 'experience' })
  const skills = watch('skills')

  return (
    <div className="space-y-4">
      <SectionCard title="Contact">
        {/* `maxLength` mirrors the schema cap on every field: the input stops
            accepting text at the limit instead of letting someone write past it
            and meet a validation error afterwards. See RESUME_LIMITS. */}
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Full name"
            required
            maxLength={RESUME_LIMITS.fullName}
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <TextField
            label="Headline"
            required
            placeholder="Frontend Engineer"
            maxLength={RESUME_LIMITS.headline}
            error={errors.headline?.message}
            {...register('headline')}
          />
          <TextField
            label="Email"
            type="email"
            maxLength={RESUME_LIMITS.email}
            error={errors.email?.message}
            {...register('email')}
          />
          <TextField label="Phone" maxLength={RESUME_LIMITS.phone} {...register('phone')} />
          <TextField
            label="Location"
            maxLength={RESUME_LIMITS.location}
            {...register('location')}
          />
          <TextField label="Website" maxLength={RESUME_LIMITS.website} {...register('website')} />
        </div>
      </SectionCard>

      <SectionCard
        title="Summary"
        description="Two or three sentences. Lead with your strongest signal."
      >
        <div className="space-y-1.5">
          <Label htmlFor="resume-summary">Professional summary</Label>
          <Textarea
            id="resume-summary"
            rows={4}
            maxLength={RESUME_LIMITS.summary}
            {...register('summary')}
          />
        </div>
      </SectionCard>

      <SectionCard title="Experience">
        {/*
         * Hairline-separated groups, not boxes.
         *
         * Each role used to be `rounded-lg border p-4` inside `SectionCard`
         * (`bg-card ring-1 rounded-xl p-5`) — a card inside a card, which
         * DESIGN.md §5 forbids in bold. A divider plus the role label does the
         * same grouping job with none of the nesting, and reads calmer in a
         * form that can run to four or five roles.
         */}
        <div className="divide-border/70 -my-1 divide-y">
          {fields.map((field, i) => (
            <div key={field.id} className="space-y-3 py-5 first:pt-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-medium">Role {i + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove role ${i + 1}`}
                  onClick={() => remove(i)}
                >
                  <Icon name="delete" size="xs" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  label="Role"
                  maxLength={RESUME_LIMITS.role}
                  error={errors.experience?.[i]?.role?.message}
                  {...register(`experience.${i}.role`)}
                />
                <TextField
                  label="Company"
                  maxLength={RESUME_LIMITS.company}
                  error={errors.experience?.[i]?.company?.message}
                  {...register(`experience.${i}.company`)}
                />
              </div>
              <TextField
                label="Period"
                placeholder="2023 — Present"
                maxLength={RESUME_LIMITS.period}
                {...register(`experience.${i}.period`)}
              />
              <div className="space-y-1.5">
                <Label htmlFor={`resume-hl-${i}`}>
                  Highlights{' '}
                  <span className="text-muted-foreground font-normal">(one per line)</span>
                </Label>
                <Textarea
                  id={`resume-hl-${i}`}
                  rows={3}
                  maxLength={RESUME_LIMITS.highlights}
                  {...register(`experience.${i}.highlights`)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Outside the divider stack: an action is not another role, and a rule
            above it would read as one.

            Disabled rather than hidden at the cap: a button that vanishes leaves
            the user hunting for it, where a disabled one with a reason attached
            explains itself. 25 roles is far past any real CV. */}
        <Button
          type="button"
          variant="outline"
          fullWidth
          className="mt-5"
          disabled={fields.length >= RESUME_LIMITS.experience}
          leftIcon={<Icon name="add" size="sm" />}
          onClick={() =>
            append({ id: crypto.randomUUID(), role: '', company: '', period: '', highlights: '' })
          }
        >
          {fields.length >= RESUME_LIMITS.experience
            ? `That’s the maximum of ${RESUME_LIMITS.experience} roles`
            : 'Add role'}
        </Button>
      </SectionCard>

      <SectionCard title="Skills" description="Press Enter after each skill.">
        <SkillsInput
          value={skills}
          onChange={(value) => setValue('skills', value, { shouldDirty: true })}
        />
      </SectionCard>
    </div>
  )
}
