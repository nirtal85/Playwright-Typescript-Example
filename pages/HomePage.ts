import type { Locator, Page } from "@playwright/test";
import { test } from "@playwright/test";

export class HomePage {
	readonly page: Page;
	readonly getStartedLink: Locator;

	constructor(page: Page) {
		this.page = page;
		this.getStartedLink = page.getByRole("link", { name: "Get started" });
	}

	async clickGetStarted() {
		await test.step("Click on Get Started link", async () => {
			await this.getStartedLink.click();
		});
	}
}
