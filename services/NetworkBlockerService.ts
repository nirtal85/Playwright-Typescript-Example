import type { Page, Route } from "@playwright/test";

/**
 * Service to handle blocking network requests using Playwright's page.route().
 * The Page object is provided during instantiation.
 */
export class NetworkBlockerService {
	private readonly page: Page;
	private readonly routeHandlers = new Map<
		string,
		(route: Route) => Promise<void>
	>();

	constructor(page: Page) {
		this.page = page;
	}

	/**
	 * Applies routing rules to block network requests matching the provided URL patterns.
	 */
	async blockUrls(urlsToBlock: string[]): Promise<void> {
		for (const urlPattern of urlsToBlock) {
			const handler = async (route: Route) => {
				await route.abort();
			};
			this.routeHandlers.set(urlPattern, handler);
			await this.page.route(urlPattern, handler);
		}
	}

	/**
	 * Removes all routing rules previously set on the page.
	 */
	async unblockAll(): Promise<void> {
		for (const [pattern, handler] of this.routeHandlers.entries()) {
			await this.page.unroute(pattern, handler);
		}
		this.routeHandlers.clear();
	}
}
