import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

/**
 * BDD POM Playwright configuration for GDS Demo App UI Test Suite.
 * Target: https://lokeshsharma99.github.io/GDS-Demo-App/
 *
 * Framework: playwright-bdd (Cucumber/Gherkin) + Page Object Model
 * Runs headless in CI (Azure Pipelines / GitHub Actions).
 */
const testDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: ['tests/steps/**/*.ts', 'tests/fixtures/world.ts'],
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
