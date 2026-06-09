import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/world';

const { When } = createBdd(test);

// ── When ──────────────────────────────────────────────────────────────────────

When('I enter email address {string}', async ({ contactPage }, email: string) => {
  await contactPage.emailInput.fill(email);
});

When('I enter postcode {string}', async ({ contactPage }, postcode: string) => {
  await contactPage.postcodeInput.fill(postcode);
});
