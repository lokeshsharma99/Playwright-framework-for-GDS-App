import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the Landing / Service Selection page.
 * URL: https://lokeshsharma99.github.io/GDS-Demo-App/
 *
 * Note: The radio inputs use IDs like `service-universal-credit` and the
 * "Start now" button uses `aria-disabled` (not the HTML `disabled` attribute).
 */
export class LandingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ──────────────────────────────────────────────────────────────

  get pageHeading(): Locator {
    return this.page.getByRole('heading', { level: 1, name: 'Apply for Benefits and Support' });
  }

  get introText(): Locator {
    return this.page.getByText('Select the benefit you want to apply for');
  }

  get benefitQuestion(): Locator {
    return this.page.getByText('Which benefit are you applying for?');
  }

  // Radio buttons targeted via their value attribute (reliable across GDS styling)
  get universalCreditRadio(): Locator {
    return this.page.locator('input[type="radio"][value="universal-credit"]');
  }

  get housingBenefitRadio(): Locator {
    return this.page.locator('input[type="radio"][value="housing-benefit"]');
  }

  get jobseekersAllowanceRadio(): Locator {
    return this.page.locator('input[type="radio"][value="jobseekers-allowance"]');
  }

  // Labels for each radio (used to check option text is visible)
  get universalCreditLabel(): Locator {
    return this.page.locator('label[for="service-universal-credit"]');
  }

  get housingBenefitLabel(): Locator {
    return this.page.locator('label[for="service-housing-benefit"]');
  }

  get jobseekersAllowanceLabel(): Locator {
    return this.page.locator('label[for="service-jobseekers-allowance"]');
  }

  // The "Start now" button uses aria-disabled, NOT the HTML disabled attribute
  get startNowButton(): Locator {
    return this.page.getByRole('button', { name: /Start now/i });
  }

  get beforeYouStartHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Before you start' });
  }

  get helpSectionHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Get help with your application' });
  }

  get helpPhoneNumber(): Locator {
    return this.page.getByRole('link', { name: '0800 328 5644' });
  }

  get breadcrumbNav(): Locator {
    return this.page.getByRole('navigation', { name: 'Breadcrumb' });
  }

  get homeBreadcrumb(): Locator {
    return this.breadcrumbNav.getByRole('link', { name: 'Home' });
  }

  get benefitsBreadcrumb(): Locator {
    return this.breadcrumbNav.getByRole('link', { name: 'Benefits' });
  }

  get requiredDocumentsList(): Locator {
    return this.page.locator('section[aria-labelledby="before-you-start"] ul');
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.page.goto('https://lokeshsharma99.github.io/GDS-Demo-App/');
  }

  /** Select a benefit radio by its value ID (used by BDD step definitions). */
  async selectBenefit(benefitId: string): Promise<void> {
    await this.page.locator(`input[type="radio"][value="${benefitId}"]`).check();
  }

  async selectUniversalCredit(): Promise<void> {
    await this.universalCreditRadio.check();
  }

  async selectHousingBenefit(): Promise<void> {
    await this.housingBenefitRadio.check();
  }

  async selectJobseekersAllowance(): Promise<void> {
    await this.jobseekersAllowanceRadio.check();
  }

  async startApplication(benefit: 'universal-credit' | 'housing-benefit' | 'jobseekers-allowance' = 'universal-credit'): Promise<void> {
    await this.selectBenefit(benefit);
    await this.startNowButton.click();
  }

  /** Returns true when the button is NOT aria-disabled */
  async isStartNowEnabled(): Promise<boolean> {
    const ariaDisabled = await this.startNowButton.getAttribute('aria-disabled');
    return ariaDisabled !== 'true';
  }
}

