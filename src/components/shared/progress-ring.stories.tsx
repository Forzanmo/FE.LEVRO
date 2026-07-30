import type { Meta, StoryObj } from '@storybook/nextjs'

import { ProgressRing } from './progress-ring'

const meta: Meta<typeof ProgressRing> = {
  title: 'Shared/ProgressRing',
  component: ProgressRing,
  tags: ['autodocs'],
  args: { value: 68, size: 160, label: 'Progress' },
}
export default meta

type Story = StoryObj<typeof ProgressRing>

export const Default: Story = {
  render: (args) => (
    <ProgressRing {...args}>
      <div className="font-mono text-4xl font-semibold tabular-nums">{args.value}</div>
    </ProgressRing>
  ),
}

export const Values: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {[24, 52, 84].map((v) => (
        <ProgressRing key={v} value={v} size={120} strokeWidth={10} label={`${v} percent`}>
          <span className="font-mono text-2xl font-semibold tabular-nums">{v}</span>
        </ProgressRing>
      ))}
    </div>
  ),
}
