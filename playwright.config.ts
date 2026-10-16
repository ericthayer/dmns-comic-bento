import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir:'tests/e2e', fullyParallel:false, workers:2, timeout:60_000, expect:{timeout:8000},
  reporter:[['list'],['json',{outputFile:'work/playwright-results.json'}]],
  use:{baseURL:'http://127.0.0.1:4188',trace:'retain-on-failure',screenshot:'only-on-failure',colorScheme:'light'},
  webServer:{command:'PORT=4188 npm run serve',url:'http://127.0.0.1:4188',reuseExistingServer:false,timeout:15000},
  projects:[{name:'chromium',use:{...devices['Desktop Chrome']}},{name:'firefox',use:{...devices['Desktop Firefox']},testMatch:'fallback.spec.ts'},{name:'webkit',use:{...devices['Desktop Safari']},testMatch:'fallback.spec.ts'}],
});
