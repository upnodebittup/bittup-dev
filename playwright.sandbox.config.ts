import {defineConfig} from '@playwright/test'
export default defineConfig({
  testDir:'tests/e2e',testMatch:'checkout.sandbox.spec.ts',workers:1,timeout:180000,expect:{timeout:30000},outputDir:'test-results/sandbox',
  reporter:[['list'],['html',{open:'never',outputFolder:'playwright-report/sandbox'}]],
  use:{baseURL:process.env.BITTUP_SANDBOX_BASE_URL,screenshot:'only-on-failure',trace:'retain-on-failure'},
})
