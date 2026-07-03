import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  // Allow 2 Playwright-level retries; APIClient also retries internally on 405
  retries: 2,
  // Run tests sequentially to avoid rate-limiting the free public API
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright'],
  ],
  use: {
    httpCredentials: undefined,
  },
  timeout: 30000,
  globalTimeout: 600000,
});

