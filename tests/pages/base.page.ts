import { Page, Locator } from '@playwright/test';

/**
 * Base page object providing common GOV.UK page elements.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Header ──────────────────────────────────────────────────────────────

  get govukLogo(): Locator {
    return this.page.getByRole('link', { name: 'GOV.UK' });
  }

  get betaBanner(): Locator {
    return this.page.getByText('BETA');
  }

  get feedbackLink(): Locator {
    return this.page.getByRole('link', { name: 'feedback' });
  }

  get skipToMainContent(): Locator {
    return this.page.getByRole('link', { name: 'Skip to main content' });
  }

  // ── Footer ──────────────────────────────────────────────────────────────

  get footerHelp(): Locator {
    return this.page.getByRole('navigation', { name: 'Footer links' }).getByRole('link', { name: 'Help' });
  }

  get footerCookies(): Locator {
    return this.page.getByRole('navigation', { name: 'Footer links' }).getByRole('link', { name: 'Cookies' });
  }

  get footerContact(): Locator {
    return this.page.getByRole('navigation', { name: 'Footer links' }).getByRole('link', { name: 'Contact' });
  }

  get footerTerms(): Locator {
    return this.page.getByRole('navigation', { name: 'Footer links' }).getByRole('link', { name: 'Terms and conditions' });
  }

  get openGovernmentLicenceLink(): Locator {
    return this.page.getByRole('link', { name: 'Open Government Licence v3.0' });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  async getErrorSummaryMessages(): Promise<string[]> {
    const errorList = this.page.getByRole('alert', { name: 'There is a problem' }).getByRole('list');
    const items = await errorList.getByRole('listitem').allTextContents();
    return items.map((t) => t.trim());
  }

  async hasErrorSummary(): Promise<boolean> {
    return this.page.getByRole('alert', { name: 'There is a problem' }).isVisible();
  }
}
