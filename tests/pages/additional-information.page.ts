import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for Step 3 – Additional Information.
 * URL: #/apply/additional
 */
export class AdditionalInformationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ──────────────────────────────────────────────────────────────

  get pageHeading(): Locator {
    return this.page.getByRole('heading', { level: 1, name: 'Additional information' });
  }

  get progressIndicator(): Locator {
    return this.page.getByText('Step 3 of 4');
  }

  get employmentStatusSelect(): Locator {
    return this.page.getByLabel('Employment status');
  }

  get additionalInfoTextarea(): Locator {
    return this.page.getByLabel(/additional information|any additional/i);
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: /Submit/i });
  }

  get previousButton(): Locator {
    return this.page.getByRole('button', { name: 'Previous' });
  }

  get additionalInfoHint(): Locator {
    return this.page.getByText("Tell us anything else you think is relevant");
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  async fillAdditionalInfo(data: {
    employmentStatus?: string;
    additionalInfo?: string;
  }): Promise<void> {
    if (data.employmentStatus !== undefined) {
      await this.employmentStatusSelect.selectOption({ label: data.employmentStatus });
    }
    if (data.additionalInfo !== undefined) {
      const textarea = this.additionalInfoTextarea;
      if (await textarea.isVisible()) {
        await textarea.fill(data.additionalInfo);
      }
    }
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  async clickPrevious(): Promise<void> {
    await this.previousButton.click();
  }

  async fillAndSubmit(data: {
    employmentStatus?: string;
    additionalInfo?: string;
  }): Promise<void> {
    await this.fillAdditionalInfo(data);
    await this.clickSubmit();
  }

  async getEmploymentOptions(): Promise<string[]> {
    const select = this.employmentStatusSelect;
    return select.locator('option').allTextContents();
  }
}
