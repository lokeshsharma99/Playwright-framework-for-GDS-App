import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for Step 2 – Contact Information.
 * URL: #/apply/contact
 */
export class ContactInformationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ──────────────────────────────────────────────────────────────

  get pageHeading(): Locator {
    return this.page.getByRole('heading', { level: 1, name: 'Contact information' });
  }

  get progressIndicator(): Locator {
    return this.page.getByText('Step 2 of 4');
  }

  get emailInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Email address' });
  }

  get phoneInput(): Locator {
    return this.page.getByRole('textbox', { name: 'UK telephone number' });
  }

  get addressInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Address line 1' });
  }

  get cityInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Town or city' });
  }

  get postcodeInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Postcode' });
  }

  get continueButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue' });
  }

  get previousButton(): Locator {
    return this.page.getByRole('button', { name: 'Previous' });
  }

  get backLink(): Locator {
    return this.page.getByRole('link', { name: /Back/i }).first();
  }

  get emailHint(): Locator {
    return this.page.getByText("We'll only use this to contact you");
  }

  get phoneHint(): Locator {
    return this.page.getByText('Include the country code for international numbers');
  }

  get postcodeHint(): Locator {
    return this.page.getByText('For example, SW1A 1AA');
  }

  // ── Error locators ────────────────────────────────────────────────────────

  get emailError(): Locator {
    return this.page.getByRole('alert').filter({ hasText: /email/i });
  }

  get phoneError(): Locator {
    return this.page.getByRole('alert').filter({ hasText: /telephone/i });
  }

  get postcodeError(): Locator {
    return this.page.getByRole('alert').filter({ hasText: /postcode/i });
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  async fillContactDetails(data: {
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    postcode?: string;
  }): Promise<void> {
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
    if (data.address !== undefined) await this.addressInput.fill(data.address);
    if (data.city !== undefined) await this.cityInput.fill(data.city);
    if (data.postcode !== undefined) await this.postcodeInput.fill(data.postcode);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async clickPrevious(): Promise<void> {
    await this.previousButton.click();
  }

  async fillAndContinue(data: {
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    postcode?: string;
  }): Promise<void> {
    await this.fillContactDetails(data);
    await this.clickContinue();
  }
}
