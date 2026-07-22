'use client'

import { useFieldArray, type UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/field'
import { Icon } from '@/components/ui/icon'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Heading, Text } from '@/components/ui/typography'
import type { ResumeData } from '@/lib/validators/resume-schema'

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
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Full name" required error={errors.fullName?.message} {...register('fullName')} />
          <TextField
            label="Headline"
            required
            placeholder="Frontend Engineer"
            error={errors.headline?.message}
            {...register('headline')}
          />
          <TextField label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <TextField label="Phone" {...register('phone')} />
          <TextField label="Location" {...register('location')} />
          <TextField label="Website" {...register('website')} />
        </div>
      </SectionCard>

      <SectionCard title="Summary" description="Two or three sentences. Lead with your strongest signal.">
        <div className="space-y-1.5">
          <Label htmlFor="resume-summary">Professional summary</Label>
          <Textarea id="resume-summary" rows={4} {...register('summary')} />
        </div>
      </SectionCard>

      <SectionCard title="Experience">
        <div className="space-y-5">
          {fields.map((field, i) => (
            <div key={field.id} className="border-border space-y-3 rounded-lg border p-4">
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
                  error={errors.experience?.[i]?.role?.message}
                  {...register(`experience.${i}.role`)}
                />
                <TextField
                  label="Company"
                  error={errors.experience?.[i]?.company?.message}
                  {...register(`experience.${i}.company`)}
                />
              </div>
              <TextField
                label="Period"
                placeholder="2023 — Present"
                {...register(`experience.${i}.period`)}
              />
              <div className="space-y-1.5">
                <Label htmlFor={`resume-hl-${i}`}>
                  Highlights <span className="text-muted-foreground font-normal">(one per line)</span>
                </Label>
                <Textarea id={`resume-hl-${i}`} rows={3} {...register(`experience.${i}.highlights`)} />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            fullWidth
            leftIcon={<Icon name="add" size="sm" />}
            onClick={() =>
              append({ id: crypto.randomUUID(), role: '', company: '', period: '', highlights: '' })
            }
          >
            Add role
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Skills" description="Press Enter after each skill.">
        <SkillsInput value={skills} onChange={(value) => setValue('skills', value, { shouldDirty: true })} />
      </SectionCard>
    </div>
  )
}
