import { ApplicationWorkspaceView } from '@/features/applications/application-workspace-view'

export default async function ApplicationWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ApplicationWorkspaceView applicationId={id} />
}
