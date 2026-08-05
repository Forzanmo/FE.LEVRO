import { AdminQuestionSetView } from '@/features/admin/admin-question-set-view'

export default async function AdminQuestionSetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AdminQuestionSetView versionId={id} />
}
