import { Page } from '@playwright/test';

/**
 * Service to handle blocking network requests using Playwright's page.route().
 * The Page object is provided during instantiation.
 */
export class NetworkBlockerService {
  private readonly page: Page;

  /**
   * Creates an instance of NetworkBlockerService.
   * @param {Page} page The Playwright Page object to manage routes for.
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Applies routing rules to block network requests matching the provided URL patterns.
   *
   * @param {string[]} urlsToBlock An array of URL patterns (globs, regex, etc.) to block.
   * @returns {Promise<void>}
   * @throws May throw if setting up a route fails unexpectedly.
   */
  async blockUrls(urlsToBlock: string[]): Promise<void> {
    // Use Promise.all for potentially parallel route setup
    await Promise.all(
      urlsToBlock.map(urlPattern =>
        this.page.route(urlPattern, (route) => {
          route.abort();
        })
      )
    );
  }

  /**
   * Removes all routing rules previously set on the page.
   * Note: This might unroute more than just the blocked URLs if other routes were added elsewhere.
   *
   * @returns {Promise<void>}
   */
  async unblockAll(): Promise<void> {
    await this.page.unroute('**/*');
  }
}
