import * as React from 'react'
import type { Preview } from '@storybook/nextjs'

import { fontVariables } from '../src/config/fonts'

import '../src/app/globals.css'

/**
 * Global Storybook config. A toolbar toggle applies our `.dark` class so every
 * story is verifiable in both themes using the real design tokens.
 */
const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: { test: 'error' },
  },
  globalTypes: {
    theme: {
      description: 'Color scheme',
      defaultValue: 'light',
      toolbar: {
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === 'dark'
      return (
        <div
          className={`${fontVariables} ${isDark ? 'dark' : ''} bg-background text-foreground`}
          style={{ padding: '2rem', minWidth: '20rem' }}
        >
          <Story />
        </div>
      )
    },
  ],
}

export default preview
