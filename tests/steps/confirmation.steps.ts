import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from '../fixtures/world';
import { VALID_PERSONAL_DATA } from '../fixtures/test-data';

const { Then } = createBdd(test);

// ── Then ──────────────────────────────────────────────────────────────────────

Then('I should see a reference number starting with {string}', async ({ confirmationPage }, prefix: string) => {
  await expect(confirmationPage.referenceNumber).toBeVisible();
  const refNum = await confirmationPage.getReferenceNumber();
  expect(refNum).toMatch(new RegExp(`^${prefix}`));
});

Then('the summary should display my submitted first name', async ({ confirmationPage }) => {
  const summary = await confirmationPage.getSummaryValues();
  expect(summary['First name']).toBe(VALID_PERSONAL_DATA.firstName);
});

Then('the summary should display my submitted last name', async ({ confirmationPage }) => {
  const summary = await confirmationPage.getSummaryValues();
  expect(summary['Last name']).toBe(VALID_PERSONAL_DATA.lastName);
});
