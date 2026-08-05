import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './manual-capture',
  fullyParallel: false,
  workers: 1,
  timeout: 300_000,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    colorScheme: 'light',
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 960 },
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
