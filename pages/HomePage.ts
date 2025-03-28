import { type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly getStartedLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
  }

  async clickGetStarted() {
    await this.getStartedLink.click();
  }
}
