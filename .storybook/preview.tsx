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

      /*
       * Font variables and the theme class belong on <html>, exactly where the
       * app puts them — NOT on this decorator div.
       *
       * `globals.css` applies `font-sans` to `body`, and `--font-sans` is
       * declared below body in the cascade. With the variables scoped to a div
       * *inside* body, that declaration resolved to nothing and body fell back
       * to Times New Roman. Headings carry `font-heading` so they looked right,
       * but every non-heading run rendered serif — 50 of 73 measured text nodes.
       * Storybook is where this team reviews components and runs a11y checks,
       * so it was quietly reviewing the wrong typeface.
       */
      React.useEffect(() => {
        const root = document.documentElement
        const fontClasses = fontVariables.split(' ').filter(Boolean)
        root.classList.add(...fontClasses)
        root.classList.toggle('dark', isDark)
        return () => root.classList.remove(...fontClasses)
      }, [isDark])

      return (
        <div
          className="bg-background text-foreground"
          style={{ padding: '2rem', minWidth: '20rem' }}
        >
          <Story />
        </div>
      )
    },
  ],
}

export default preview
