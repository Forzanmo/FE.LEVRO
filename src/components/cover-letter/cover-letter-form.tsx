'use client'

import { Controller, type UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/field'
import { Icon } from '@/components/ui/icon'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { COVER_LETTER_TONES } from '@/features/cover-letter/types'
import {
  COVER_LETTER_LIMITS,
  type CoverLetterFormValues,
} from '@/lib/validators/cover-letter-schema'

export function CoverLetterForm({
  form,
  onGenerate,
  isGenerating,
}: {
  form: UseFormReturn<CoverLetterFormValues>
  onGenerate: (e: React.FormEvent) => void
  isGenerating: boolean
}) {
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <form
      onSubmit={onGenerate}
      className="bg-card ring-foreground/10 space-y-4 rounded-xl p-5 ring-1"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Company"
          required
          maxLength={COVER_LETTER_LIMITS.company}
          error={errors.company?.message}
          {...register('company')}
        />
        <TextField
          label="Role"
          required
          maxLength={COVER_LETTER_LIMITS.role}
          error={errors.role?.message}
          {...register('role')}
        />
      </div>
      <TextField
        label="Hiring manager"
        placeholder="Optional"
        maxLength={COVER_LETTER_LIMITS.hiringManager}
        {...register('hiringManager')}
      />
      <div className="space-y-1.5">
        <Label htmlFor="cl-tone">Tone</Label>
        <Controller
          control={control}
          name="tone"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="cl-tone" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COVER_LETTER_TONES.map((tone) => (
                  <SelectItem key={tone.value} value={tone.value}>
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cl-highlights">
          Key points <span className="text-muted-foreground font-normal">(one per line)</span>
        </Label>
        <Textarea
          id="cl-highlights"
          rows={4}
          maxLength={COVER_LETTER_LIMITS.highlights}
          placeholder="e.g. Shipped a component library used across 4 products"
          {...register('highlights')}
        />
      </div>
      <Button
        type="submit"
        variant="gradient"
        fullWidth
        isLoading={isGenerating}
        leftIcon={isGenerating ? undefined : <Icon name="sparkles" size="sm" />}
      >
        {isGenerating ? 'Generating…' : 'Generate cover letter'}
      </Button>
    </form>
  )
}
