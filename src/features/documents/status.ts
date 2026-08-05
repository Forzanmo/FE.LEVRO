import type { IconName } from '@/components/ui/icon'

import type { DocumentKind, DocumentStatus } from './types'

/* Both maps are the single vocabulary for document state and kind, shared by
   the library, the dashboard card, and the detail header. */

/**
 * One vocabulary for document state, shared by the dashboard card and the
 * library. Two places rendering the same status differently is how a product
 * starts feeling like several products.
 */
export const STATUS_META: Record<
  DocumentStatus,
  { label: string; tone: string; icon: IconName }
> = {
  draft: { label: 'Draft', tone: 'bg-muted text-muted-foreground', icon: 'edit' },
  ready: { label: 'Ready to send', tone: 'bg-brand-muted text-brand', icon: 'success' },
  // Sent is the completed state, so it wears the accent — DESIGN.md's
  // Teal-Is-Earned Rule. Teal means done, nowhere else. `ready` sits one step
  // back on the brand navy, which is a different colour at a glance rather than
  // a lighter version of the same one.
  sent: { label: 'Sent', tone: 'bg-achievement-muted text-achievement', icon: 'send' },
}

export const KIND_META: Record<DocumentKind, { label: string; icon: IconName }> = {
  cv: { label: 'CV', icon: 'resume' },
  'cover-letter': { label: 'Cover letter', icon: 'cover-letter' },
}
