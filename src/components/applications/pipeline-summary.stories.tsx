import type { Meta, StoryObj } from '@storybook/nextjs'

import { applicationsService } from '@/services/api/applications-service'

import { PipelineSummary } from './pipeline-summary'

const meta: Meta<typeof PipelineSummary> = {
  title: 'Applications/PipelineSummary',
  component: PipelineSummary,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof PipelineSummary>

export const Default: Story = {
  render: () => <PipelineSummary applications={applicationsService.getApplications()} />,
}
