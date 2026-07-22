import type { Metadata } from 'next'

import { CoverLetterView } from '@/features/cover-letter/cover-letter-view'

export const metadata: Metadata = {
  title: 'Cover Letter',
}

export default function CoverLetterPage() {
  return <CoverLetterView />
}
