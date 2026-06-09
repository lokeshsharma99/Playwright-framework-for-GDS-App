import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from '../fixtures/world';
import { VALID_PERSONAL_DATA, VALID_CONTACT_DATA, VALID_ADDITIONAL_DATA } from '../fixtures/test-data';

const { Given, When, Then } = createBdd(test);

const BASE_URL = 'https://lokeshsharma99.github.io/GDS-Demo-App/';

/** URL patterns for each application step */
const PAGE_URL: Record<string, RegExp> = {
  'Personal Details':       /#\/apply\/personal/,
  'Contact Information':    /#\/apply\/contact/,
  'Additional Information': /#\/apply\/additional/,
  'Confirmation':           /#\/apply\/confirmation/,
};

// ── Given ─────────────────────────────────────────────────────────────────────

Given('I am on the GDS benefits landing page', async ({ landingPage }) => {
  await landingPage.goto();
});

Given('I start a {string} application', async ({ landingPage }, benefitId: string) => {
  await landingPage.selectBenefit(benefitId);
  await landingPage.startNowButton.click();
});

Given('I complete the personal details step with valid data', async ({ personalDetailsPage }) => {
  await personalDetailsPage.fillAndContinue(VALID_PERSONAL_DATA);
});

Given('I complete the contact information step with valid data', async ({ contactPage }) => {
  await contactPage.fillAndContinue(VALID_CONTACT_DATA);
});

Given('I have completed a full Universal Credit application', async ({
  landingPage, personalDetailsPage, contactPage, additionalPage,
}) => {
  await landingPage.goto();
  await landingPage.selectBenefit('universal-credit');
  await landingPage.startNowButton.click();
  await personalDetailsPage.fillAndContinue(VALID_PERSONAL_DATA);
  await contactPage.fillAndContinue(VALID_CONTACT_DATA);
  await additionalPage.fillAndSubmit(VALID_ADDITIONAL_DATA);
});

// ── When ──────────────────────────────────────────────────────────────────────

When('I click continue', async ({ page }) => {
  await page.getByRole('button', { name: /continue/i }).click();
});

When('I click previous', async ({ page }) => {
  await page.getByRole('button', { name: /previous/i }).click();
});

When('I click submit application', async ({ page }) => {
  await page.getByRole('button', { name: /submit/i }).click();
});

When('I click back', async ({ page }) => {
  await page.getByRole('link', { name: /back/i }).first().click();
});

When('I click {string}', async ({ page }, label: string) => {
  // Try exact button match first, then partial, then link
  const exactBtn = page.getByRole('button', { name: label, exact: true });
  if (await exactBtn.count() > 0) {
    await exactBtn.click();
    return;
  }
  const partialBtn = page.getByRole('button', { name: label });
  if (await partialBtn.count() > 0) {
    await partialBtn.click();
    return;
  }
  await page.getByRole('link', { name: label }).click();
});

When('I fill in my personal details with valid data', async ({ personalDetailsPage }) => {
  await personalDetailsPage.fillPersonalDetails(VALID_PERSONAL_DATA);
});

When('I fill in my contact details with valid data', async ({ contactPage }) => {
  await contactPage.fillContactDetails(VALID_CONTACT_DATA);
});

// ── Then — page navigation ────────────────────────────────────────────────────

Then('I should be on the {string} page', async ({ page }, pageName: string) => {
  const pattern = PAGE_URL[pageName];
  if (!pattern) throw new Error(`No URL pattern defined for page: "${pageName}"`);
  await expect(page).toHaveURL(pattern);
});

Then('I should be on the landing page', async ({ page }) => {
  // After returning to services the app navigates to /#/ or just the base URL
  await expect(page).toHaveURL(/lokeshsharma99\.github\.io\/GDS-Demo-App\/?#?\/?$/);
});

// ── Then — general assertions ─────────────────────────────────────────────────

Then('the page title should be {string}', async ({ page }, title: string) => {
  await expect(page).toHaveTitle(title);
});

Then('I should see the heading {string}', async ({ page }, heading: string) => {
  await expect(page.getByRole('heading', { name: heading })).toBeVisible();
});

Then('I should see the progress indicator {string}', async ({ page }, text: string) => {
  await expect(page.getByText(text)).toBeVisible();
});

Then('I should see the {string} field', async ({ page }, label: string) => {
  // Try getByLabel first; fall back to text-based lookup for selects/textareas
  const el = page.getByLabel(label);
  await expect(el).toBeVisible();
});

Then('I should see the {string} section', async ({ page }, sectionName: string) => {
  await expect(page.getByRole('heading', { name: sectionName })).toBeVisible();
});

Then('I should see the text {string}', async ({ page }, text: string) => {
  await expect(page.getByText(text)).toBeVisible();
});

Then('I should see a link to {string}', async ({ page }, linkText: string) => {
  await expect(page.getByRole('link', { name: linkText })).toBeVisible();
});
