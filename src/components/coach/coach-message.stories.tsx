import type { Meta, StoryObj } from '@storybook/nextjs'

import { CoachMessage } from './coach-message'

const meta: Meta<typeof CoachMessage> = {
  title: 'Coach/CoachMessage',
  component: CoachMessage,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
  args: {
    prompt: 'What role are you aiming for?',
    reasoning: 'Your target role sets the exact skill bar we measure you against.',
  },
}
export default meta

type Story = StoryObj<typeof CoachMessage>

export const Current: Story = { args: { emphasized: true } }

export const History: Story = {}

export const WithoutReasoning: Story = { args: { reasoning: undefined } }
