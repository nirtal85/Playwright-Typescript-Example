import { expect } from "@playwright/test";
import { test } from "@src/fixtures/projectFixtures";

test.use({
	geolocation: { latitude: 1, longitude: 1 },
});

test.skip("Geolocation example", async ({ page }) => {
	await test.step("Navigate to Playwright website", async () => {
		await page.goto("https://playwright.dev/");
	});
	await test.step("Check page title", async () => {
		await expect(page).toHaveTitle(/Playwright/);
	});
});
