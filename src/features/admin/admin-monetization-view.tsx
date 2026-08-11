'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Text } from '@/components/ui/typography'
import type { MonetizationConfig, PricingPlan } from '@/features/monetization/types'
import { ROUTES } from '@/lib/constants/routes'
import { DEFAULT_MONETIZATION, monetizationStorage } from '@/services/storage/monetization-storage'

export function AdminMonetizationView() {
  const [draft, setDraft] = useState<MonetizationConfig>(DEFAULT_MONETIZATION)
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setDraft(monetizationStorage.load()))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const updatePlan = (index: number, patch: Partial<PricingPlan>) => {
    setDraft((current) => {
      const plans = [...current.plans] as MonetizationConfig['plans']
      plans[index] = { ...plans[index], ...patch }
      if (patch.featured) plans.forEach((plan, planIndex) => { plan.featured = planIndex === index })
      return { ...current, plans }
    })
  }

  const save = () => {
    monetizationStorage.save(draft)
    toast.success('Pricing and offer published on this frontend')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monetization"
        description="Edit the three public packages and the floating subscription offer."
        actions={<Button asChild variant="outline"><Link href={ROUTES.admin}>Back to admin</Link></Button>}
      />

      <section className="border-border border-t pt-6">
        <div className="mb-5">
          <h2 className="font-heading text-lg font-semibold">Pricing introduction</h2>
          <Text tone="muted" size="sm">This copy appears above the three plans on the landing page.</Text>
        </div>
        <div className="grid gap-4">
          <div className="space-y-2"><Label htmlFor="pricing-heading">Heading</Label><Input id="pricing-heading" value={draft.heading} onChange={(event) => setDraft({ ...draft, heading: event.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="pricing-description">Description</Label><Textarea id="pricing-description" rows={3} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-3">
        {draft.plans.map((plan, index) => (
          <section key={plan.id} className="border-border border-t pt-5">
            <div className="mb-5"><h2 className="font-heading font-semibold">Package {index + 1}</h2><Text tone="muted" size="sm">Every field publishes to the public pricing section.</Text></div>
            <div className="space-y-4">
              <div className="space-y-2"><Label htmlFor={`plan-${index}-name`}>Name</Label><Input id={`plan-${index}-name`} value={plan.name} onChange={(event) => updatePlan(index, { name: event.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor={`plan-${index}-description`}>Description</Label><Textarea id={`plan-${index}-description`} rows={3} value={plan.description} onChange={(event) => updatePlan(index, { description: event.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label htmlFor={`plan-${index}-monthly`}>Monthly $</Label><Input id={`plan-${index}-monthly`} type="number" min="0" value={plan.monthlyPrice} onChange={(event) => updatePlan(index, { monthlyPrice: Number(event.target.value) })} /></div>
                <div className="space-y-2"><Label htmlFor={`plan-${index}-yearly`}>Annual $</Label><Input id={`plan-${index}-yearly`} type="number" min="0" value={plan.yearlyPrice} onChange={(event) => updatePlan(index, { yearlyPrice: Number(event.target.value) })} /></div>
              </div>
              <div className="space-y-2"><Label htmlFor={`plan-${index}-cta`}>Button label</Label><Input id={`plan-${index}-cta`} value={plan.cta} onChange={(event) => updatePlan(index, { cta: event.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor={`plan-${index}-features`}>Features, one per line</Label><Textarea id={`plan-${index}-features`} rows={6} value={plan.features.join('\n')} onChange={(event) => updatePlan(index, { features: event.target.value.split('\n').filter(Boolean) })} /></div>
              <div className="flex items-center justify-between gap-3"><div><Label htmlFor={`plan-${index}-featured`}>Recommended plan</Label><Text tone="muted" size="sm">Highlight this as Levrro&rsquo;s suggested starting point.</Text></div><Switch id={`plan-${index}-featured`} checked={plan.featured} onCheckedChange={(checked) => updatePlan(index, { featured: checked })} /></div>
            </div>
          </section>
        ))}
      </div>

      <section className="border-border border-t pt-6">
        <div className="mb-5"><h2 className="font-heading text-lg font-semibold">Floating subscription offer</h2><Text tone="muted" size="sm">The offer moves gently within the pricing section and can always be dismissed.</Text></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-3 sm:col-span-2"><Label htmlFor="discount-enabled">Show offer</Label><Switch id="discount-enabled" checked={draft.discount.enabled} onCheckedChange={(enabled) => setDraft({ ...draft, discount: { ...draft.discount, enabled } })} /></div>
          {(['label', 'title', 'description', 'code'] as const).map((field) => (
            <div key={field} className="space-y-2"><Label htmlFor={`discount-${field}`}>{field[0].toUpperCase() + field.slice(1)}</Label><Input id={`discount-${field}`} value={draft.discount[field]} onChange={(event) => setDraft({ ...draft, discount: { ...draft.discount, [field]: event.target.value } })} /></div>
          ))}
          <div className="space-y-2"><Label htmlFor="discount-percent">Discount percent</Label><Input id="discount-percent" type="number" min="0" max="100" value={draft.discount.percent} onChange={(event) => setDraft({ ...draft, discount: { ...draft.discount, percent: Number(event.target.value) } })} /></div>
        </div>
      </section>

      <div className="bg-background sticky bottom-[var(--bottom-nav-height)] flex justify-end border-t py-4 md:bottom-0">
        <Button size="lg" onClick={save}>Publish pricing changes</Button>
      </div>
    </div>
  )
}
