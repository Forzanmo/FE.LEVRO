import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { StorybookConfig } from '@storybook/nextjs-vite'

const storybookDir = dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  // Vite (unlike the webpack framework) doesn't read tsconfig paths — teach it
  // the `@/* -> src/*` alias the app uses.
  async viteFinal(viteConfig) {
    const { mergeConfig } = await import('vite')
    return mergeConfig(viteConfig, {
      resolve: {
        alias: {
          '@': join(storybookDir, '../src'),
        },
      },
    })
  },
}

export default config
