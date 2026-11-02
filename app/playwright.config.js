import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './src/__tests__',
  testMatch: '**/*.browser.spec.js',
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4183',
    browserName: 'chromium',
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4183 --strictPort',
    url: 'http://127.0.0.1:4183',
    reuseExistingServer: false,
  },
})
