import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for Step 1 – Personal Details.
 * URL: #/apply/personal
 */
export class PersonalDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ──────────────────────────────────────────────────────────────

  get pageHeading(): Locator {
    return this.page.getByRole('heading', { level: 1, name: 'Personal details' });
  }

  get progressIndicator(): Locator {
    return this.page.getByText('Step 1 of 4');
  }

  get progressSteps(): Locator {
    return this.page.getByRole('navigation', { name: 'Progress through application' });
  }

  get firstNameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'First name' });
  }

  get lastNameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Last name' });
  }

  get dobDayInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Day' });
  }

  get dobMonthInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Month' });
  }

  get dobYearInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Year' });
  }

  get niNumberInput(): Locator {
    return this.page.getByRole('textbox', { name: 'National Insurance number' });
  }

  get continueButton(): Locator {
    return this.page.getByRole('button', { name: 'Continu' });
  }

  get backLink(): Locator {
    return this.page.getByRole('link', { name: /Back to services/i });
  }

  get dobFieldset(): Locator {
    return this.page.getByRole('group', { name: 'Date of birth' });
  }

  get niNumberHint(): Locator {
    return this.page.getByText("It's on your National Insurance card");
  }

  // ── Error locators ────────────────────────────────────────────────────────

  get niNumberError(): Locator {
    return this.page.getByRole('alert').filter({ hasText: 'National Insurance number' });
  }

  get dobError(): Locator {
    return this.page.getByRole('alert').filter({ hasText: /date of birth/i });
  }

  get firstNameError(): Locator {
    return this.page.getByRole('alert').filter({ hasText: /first name/i });
  }

  get lastNameError(): Locator {
    return this.page.getByRole('alert').filter({ hasText: /last name/i });
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  async fillPersonalDetails(data: {
    firstName?: string;
    lastName?: string;
    dobDay?: string;
    dobMonth?: string;
    dobYear?: string;
    nationalInsurance?: string;
  }): Promise<void> {
    if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.dobDay !== undefined) await this.dobDayInput.fill(data.dobDay);
    if (data.dobMonth !== undefined) await this.dobMonthInput.fill(data.dobMonth);
    if (data.dobYear !== undefined) await this.dobYearInput.fill(data.dobYear);
    if (data.nationalInsurance !== undefined) await this.niNumberInput.fill(data.nationalInsurance);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async clickBack(): Promise<void> {
    await this.backLink.click();
  }

  async fillAndContinue(data: {
    firstName?: string;
    lastName?: string;
    dobDay?: string;
    dobMonth?: string;
    dobYear?: string;
    nationalInsurance?: string;
  }): Promise<void> {
    await this.fillPersonalDetails(data);
    await this.clickContinue();
  }
}
