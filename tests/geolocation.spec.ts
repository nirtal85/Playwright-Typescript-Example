import { expect } from "@playwright/test";
import { test } from "../src/fixtures/projectFixtures";

test.use({
	geolocation: { longitude: 1, latitude: 1 },
});

test.skip("Geolocation example", async ({ page }) => {
	await test.step("Navigate to Playwright website", async () => {
		await page.goto("https://playwright.dev/");
	});
	await test.step("Check page title", async () => {
		await expect(page).toHaveTitle(/Playwright/);
	});
});
