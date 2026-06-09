import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from '../fixtures/world';

const { When, Then } = createBdd(test);

// ── When ──────────────────────────────────────────────────────────────────────

When('I select benefit {string}', async ({ landingPage }, benefitId: string) => {
  await landingPage.selectBenefit(benefitId);
});

When('I click start now', async ({ landingPage }) => {
  await landingPage.startNowButton.click();
});

// ── Then ──────────────────────────────────────────────────────────────────────

Then('the start button should be disabled', async ({ landingPage }) => {
  // The Start now button uses aria-disabled (not the HTML disabled attribute)
  await expect(landingPage.startNowButton).toHaveAttribute('aria-disabled', 'true');
});

Then('the start button should be enabled', async ({ landingPage }) => {
  const ariaDisabled = await landingPage.startNowButton.getAttribute('aria-disabled');
  expect(ariaDisabled).not.toBe('true');
});

Then('I should see benefit option {string}', async ({ page }, benefitLabel: string) => {
  // Use the radio card label — scoped to the fieldset to avoid strict-mode violations
  const label = page.locator('fieldset').getByText(benefitLabel, { exact: true }).first();
  await expect(label).toBeVisible();
});

Then('the requirements list should mention {string}', async ({ page }, item: string) => {
  await expect(page.getByText(item)).toBeVisible();
});

Then('I should see the helpline number {string}', async ({ page }, number: string) => {
  await expect(page.getByRole('link', { name: number })).toBeVisible();
});

Then('the GOV.UK logo should be visible', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'GOV.UK' })).toBeVisible();
});

Then('the BETA banner should be visible', async ({ page }) => {
  await expect(page.getByText('BETA')).toBeVisible();
});

Then('the skip to main content link should be visible', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeVisible();
});

Then('the footer should contain a {string} link', async ({ page }, linkLabel: string) => {
  const footer = page.getByRole('contentinfo');
  await expect(footer.getByRole('link', { name: linkLabel })).toBeVisible();
});

Then('the {string} radio should be checked', async ({ page }, benefitId: string) => {
  await expect(page.locator(`input[type="radio"][value="${benefitId}"]`)).toBeChecked();
});

Then('the {string} radio should not be checked', async ({ page }, benefitId: string) => {
  await expect(page.locator(`input[type="radio"][value="${benefitId}"]`)).not.toBeChecked();
});
