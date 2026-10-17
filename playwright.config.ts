import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir:'./tests/e2e',fullyParallel:false,workers:1,timeout:180000,expect:{timeout:30000},
  reporter:[['list'],['html',{open:'never'}]],
  use:{baseURL:'http://localhost:3217',screenshot:'only-on-failure',trace:'retain-on-failure'},
  webServer:{command:'node scripts/e2e-mock-server.mjs',url:'http://localhost:3217/loja',reuseExistingServer:false,timeout:180000},
  projects:[{name:'mock',testMatch:'checkout.mock.spec.ts'}],
})
