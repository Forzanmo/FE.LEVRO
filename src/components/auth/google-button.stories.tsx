import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { GoogleButton } from './google-button'

const meta: Meta<typeof GoogleButton> = {
  title: 'Auth/GoogleButton',
  component: GoogleButton,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { onClick: () => {} },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof GoogleButton>

export const Default: Story = {}
export const SignUp: Story = { args: { label: 'Sign up with Google' } }
