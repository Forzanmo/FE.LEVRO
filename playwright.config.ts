import { defineConfig, devices } from '@playwright/test'

const PORT = 3000
const BASE_URL = `http://localhost:${PORT}`

/**
 * Playwright E2E configuration. Boots the Next dev server automatically (reusing
 * an already-running one locally) and runs specs from ./e2e.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  // The dev server compiles routes on first hit; cap workers + allow generous
  // time so a cold route under parallel load doesn't spuriously time out.
  // (Run against `next build && next start` for maximum speed/reliability.)
  timeout: 60_000,
  workers: process.env.CI ? 1 : 3,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
