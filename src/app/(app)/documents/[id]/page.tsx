import { DocumentEditorView } from '@/features/documents/document-editor-view'

export default async function DocumentEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <DocumentEditorView documentId={id} />
}
