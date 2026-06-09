import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from '../fixtures/world';

const { When, Then } = createBdd(test);

// ── When ──────────────────────────────────────────────────────────────────────

When('I select employment status {string}', async ({ additionalPage }, status: string) => {
  await additionalPage.employmentStatusSelect.selectOption({ label: status });
});

When('I enter additional information {string}', async ({ additionalPage }, info: string) => {
  await additionalPage.additionalInfoTextarea.fill(info);
});

// ── Then ──────────────────────────────────────────────────────────────────────

Then('the employment status dropdown should contain {string}', async ({ additionalPage }, option: string) => {
  const options = await additionalPage.getEmploymentOptions();
  expect(options).toContain(option);
});
