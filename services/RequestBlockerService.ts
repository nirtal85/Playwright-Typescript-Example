import { type Route } from 'playwright-core';
import { type Page } from '@playwright/test';

/**
 * Service to dynamically block network requests to specified URLs using Playwright's routing system.
 *
 * Can be enabled or disabled during test execution to simulate network conditions,
 * block trackers/ads/analytics, or improve performance by skipping unnecessary requests.
 */
export class RequestBlockerService {
  private page: Page;
  private blockedURLs: string[];
  private active = false;
  private boundHandler?: (route: Route) => Promise<void> | void;

  /**
   * @param page - The Playwright Page instance this blocker will operate on.
   * @param blockedURLs - A list of URL prefixes to block (e.g., third-party trackers or CDNs).
   */
  constructor(page: Page, blockedURLs: string[]) {
    this.page = page;
    this.blockedURLs = blockedURLs;
  }

  /**
   * Enables the request blocking by setting up a route handler that intercepts all requests.
   * Requests that match any of the `blockedURLs` will be aborted.
   *
   * Does nothing if already active.
   */
  async enable() {
    if (this.active) return;
    this.boundHandler = this.handler.bind(this);
    await this.page.route('**/*', this.boundHandler);
    this.active = true;
  }

  /**
   * Disables request blocking by removing the previously registered route handler.
   *
   * Does nothing if not currently active.
   */
  async disable() {
    if (!this.active || !this.boundHandler) return;
    await this.page.unroute('**/*', this.boundHandler);
    this.active = false;
  }

  /**
   * The internal route handler used to determine whether to block or continue a request.
   *
   * @param route - The intercepted request route.
   */
  private handler(route: Route) {
    const url = route.request().url();
    if (this.blockedURLs.some(blocked => url.startsWith(blocked))) {
      return route.abort();
    }
    return route.continue();
  }
}
