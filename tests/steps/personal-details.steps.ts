import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from '../fixtures/world';

const { When, Then } = createBdd(test);

// ── When ──────────────────────────────────────────────────────────────────────

When('I enter National Insurance number {string}', async ({ personalDetailsPage }, ni: string) => {
  await personalDetailsPage.niNumberInput.fill(ni);
});

When('I enter a first name of {int} characters', async ({ personalDetailsPage }, length: number) => {
  await personalDetailsPage.firstNameInput.fill('A'.repeat(length));
});

When('I enter date of birth {string} {string} {string}',
  async ({ personalDetailsPage }, day: string, month: string, year: string) => {
    await personalDetailsPage.dobDayInput.fill(day);
    await personalDetailsPage.dobMonthInput.fill(month);
    await personalDetailsPage.dobYearInput.fill(year);
  },
);

When('I enter date of birth day {string} without month and year',
  async ({ personalDetailsPage }, day: string) => {
    await personalDetailsPage.dobDayInput.fill(day);
    await personalDetailsPage.dobMonthInput.fill('');
    await personalDetailsPage.dobYearInput.fill('');
  },
);

// ── Then ──────────────────────────────────────────────────────────────────────

Then('I should see the date of birth fields', async ({ personalDetailsPage }) => {
  await expect(personalDetailsPage.dobDayInput).toBeVisible();
  await expect(personalDetailsPage.dobMonthInput).toBeVisible();
  await expect(personalDetailsPage.dobYearInput).toBeVisible();
});

Then('I should see an error for the {string} field', async ({ page }, fieldName: string) => {
  // Error alerts are rendered inline next to their field
  const error = page.getByRole('alert').filter({ hasText: new RegExp(fieldName, 'i') });
  await expect(error).toBeVisible();
});

Then('the error should mention {string}', async ({ page }, phrase: string) => {
  const alert = page.getByRole('alert').last();
  await expect(alert).toContainText(phrase);
});

Then('I should see an error mentioning {string}', async ({ page }, phrase: string) => {
  await expect(page.getByRole('alert').filter({ hasText: phrase })).toBeVisible();
});

Then('I should see a date of birth error mentioning {string}', async ({ page }, phrase: string) => {
  const dobError = page.getByRole('alert').filter({ hasText: new RegExp(phrase, 'i') });
  await expect(dobError).toBeVisible();
});

Then('I should see an error summary with {string}', async ({ page }, summaryHeading: string) => {
  const summary = page.getByRole('alert', { name: summaryHeading });
  await expect(summary).toBeVisible();
  await expect(summary.getByRole('heading')).toContainText(summaryHeading);
});

Then('the error summary should link to the National Insurance field', async ({ page }) => {
  const summary = page.getByRole('alert', { name: 'There is a problem' });
  const link = summary.getByRole('link').filter({ hasText: /National Insurance/i });
  await expect(link).toBeVisible();
});

Then('I should see at least {int} errors in the error summary', async ({ page }, minCount: number) => {
  const summary = page.getByRole('alert', { name: 'There is a problem' });
  await expect(summary).toBeVisible();
  const items = summary.getByRole('listitem');
  const count = await items.count();
  expect(count).toBeGreaterThanOrEqual(minCount);
});
