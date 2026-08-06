import type { Metadata } from 'next'

import { DocumentEditorView } from '@/features/documents/document-editor-view'

export const metadata: Metadata = {
  title: 'Review generated document',
}

export default async function GeneratedDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <DocumentEditorView documentId={id} />
}
