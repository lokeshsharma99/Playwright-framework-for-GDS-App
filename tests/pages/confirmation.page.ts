import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for Step 4 – Confirmation Page.
 * URL: #/apply/confirmation
 */
export class ConfirmationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ──────────────────────────────────────────────────────────────

  get confirmationPanel(): Locator {
    return this.page.getByRole('status');
  }

  get applicationSubmittedHeading(): Locator {
    return this.page.getByRole('heading', { level: 1, name: 'Application submitted' });
  }

  get referenceNumber(): Locator {
    return this.confirmationPanel.locator('strong');
  }

  get confirmationEmailText(): Locator {
    return this.page.getByText('We have sent you a confirmation email.');
  }

  get applicationSummaryHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Application summary' });
  }

  get whatHappensNextHeading(): Locator {
    return this.page.getByRole('heading', { name: 'What happens next' });
  }

  get reviewTimeText(): Locator {
    return this.page.getByText('We\'ll review your application and contact you within 5 working days.');
  }

  get universalCreditLink(): Locator {
    return this.page.getByRole('link', { name: /Find out more about Universal Credit/i });
  }

  get returnToServicesButton(): Locator {
    return this.page.getByRole('button', { name: /Return to services/i });
  }

  get summaryList(): Locator {
    return this.page.locator('dl');
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  async getReferenceNumber(): Promise<string> {
    return (await this.referenceNumber.textContent()) ?? '';
  }

  async getSummaryValues(): Promise<Record<string, string>> {
    const rows = this.summaryList.locator('div');
    const count = await rows.count();
    const result: Record<string, string> = {};
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const label = (await row.locator('dt').textContent()) ?? '';
      const value = (await row.locator('dd').textContent()) ?? '';
      result[label.trim()] = value.trim();
    }
    return result;
  }

  async clickReturnToServices(): Promise<void> {
    await this.returnToServicesButton.click();
  }
}
