import { defineConfig } from '@playwright/test'
export default defineConfig({ testDir: 'tests/mp-e2e', outputDir: '.mp-validation/playwright-results', workers: 1, timeout: 180000, expect: { timeout: 25000 },
  use: { baseURL: 'http://localhost:3219', headless: true, trace: 'retain-on-failure' },
  webServer: { command: 'node scripts/mp-test-server.mjs', url: 'http://localhost:3219', timeout: 180000, reuseExistingServer: false }, reporter: [['list']],
})
