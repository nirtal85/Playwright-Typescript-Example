import { type Locator, type Page } from '@playwright/test';
import { step } from 'allure-decorators';

export class HomePage {
  readonly page: Page;
  readonly getStartedLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
  }

  @step('Click on Get Started link')
  async clickGetStarted() {
    await this.getStartedLink.click();
  }
}
