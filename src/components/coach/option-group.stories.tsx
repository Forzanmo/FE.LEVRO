import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { OptionGroup } from './option-group'

const OPTIONS = [
  { value: 'student', label: 'Student / new grad' },
  { value: 'junior', label: 'Junior (0–2 years)' },
  { value: 'shifter', label: 'Career shifter' },
  { value: 'returning', label: 'Returning after a break' },
]

function Demo({ multiple }: { multiple: boolean }) {
  const [value, setValue] = useState<string[]>([])
  return (
    <div className="max-w-sm">
      <OptionGroup
        options={OPTIONS}
        multiple={multiple}
        value={value}
        onChange={setValue}
        legend="Where are you in your career right now?"
      />
    </div>
  )
}

const meta: Meta<typeof OptionGroup> = {
  title: 'Coach/OptionGroup',
  component: OptionGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof OptionGroup>

export const SingleSelect: Story = { render: () => <Demo multiple={false} /> }
export const MultiSelect: Story = { render: () => <Demo multiple /> }
