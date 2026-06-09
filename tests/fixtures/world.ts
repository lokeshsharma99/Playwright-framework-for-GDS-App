import { test as base } from 'playwright-bdd';
import { LandingPage } from '../pages/landing.page';
import { PersonalDetailsPage } from '../pages/personal-details.page';
import { ContactInformationPage } from '../pages/contact-information.page';
import { AdditionalInformationPage } from '../pages/additional-information.page';
import { ConfirmationPage } from '../pages/confirmation.page';

/**
 * BDD World — Playwright fixture definitions for all Page Object Models.
 * Imported by playwright.config.ts via `importTestFrom` so that step
 * definitions can receive typed POM fixtures.
 */
type Pages = {
  landingPage: LandingPage;
  personalDetailsPage: PersonalDetailsPage;
  contactPage: ContactInformationPage;
  additionalPage: AdditionalInformationPage;
  confirmationPage: ConfirmationPage;
};

export const test = base.extend<Pages>({
  landingPage: async ({ page }, use) => use(new LandingPage(page)),
  personalDetailsPage: async ({ page }, use) => use(new PersonalDetailsPage(page)),
  contactPage: async ({ page }, use) => use(new ContactInformationPage(page)),
  additionalPage: async ({ page }, use) => use(new AdditionalInformationPage(page)),
  confirmationPage: async ({ page }, use) => use(new ConfirmationPage(page)),
});
