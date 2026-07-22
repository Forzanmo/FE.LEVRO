import type { Meta, StoryObj } from '@storybook/nextjs'

import type { QuestNodeWithStatus, QuestStatus } from '@/features/roadmap/types'

import { QuestNode } from './quest-node'

const makeNode = (status: QuestStatus): QuestNodeWithStatus => ({
  id: status,
  title: 'Build a portfolio project',
  description: 'Ship one focused project that proves your target-role skills.',
  xp: 80,
  icon: 'zap',
  tier: 0,
  col: 0,
  requires: [],
  status,
})

const meta: Meta<typeof QuestNode> = {
  title: 'Roadmap/QuestNode',
  component: QuestNode,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj<typeof QuestNode>

export const States: Story = {
  render: () => (
    <div className="flex gap-12 pb-12">
      {(['completed', 'available', 'locked'] as const).map((status) => (
        <QuestNode key={status} node={makeNode(status)} selected={false} onSelect={() => {}} />
      ))}
    </div>
  ),
}
