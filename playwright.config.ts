import { defineConfig } from "@playwright/test";

import { config as dotenvConfig } from "dotenv";
import { AUTOMATION_USER_AGENT } from "./src/utilities/constants";

dotenvConfig();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [
		[
			"allure-playwright",
			{
				links: {
					issue: {
						nameTemplate: "Issue #%s",
						urlTemplate: "https://example.com/%s",
					},
					tms: {
						nameTemplate: "TMS #%s",
						urlTemplate: "https://example.com/%s",
					},
					link: {
						nameTemplate: "Link #%s",
						urlTemplate: "https://example.com/%s",
					},
				},
			},
		],
	],
	use: {
		baseURL: process.env.BASE_URL,
		screenshot: {
			mode: "only-on-failure",
			fullPage: true,
		},
		trace: "retain-on-failure",
		video: "retain-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: {
				viewport: null,
				testIdAttribute: "data-test",
				userAgent: AUTOMATION_USER_AGENT,
				permissions: [
					"geolocation",
					"microphone",
					"camera",
					"clipboard-read",
					"clipboard-write",
				],
				launchOptions: {
					timeout: 0,
					args: [
						"--start-maximized",
						"--allow-file-access-from-files",
						"--use-fake-device-for-media-stream",
						"--use-fake-ui-for-media-stream",
						"--hide-scrollbars",
						"--disable-features=IsolateOrigins,site-per-process,VizDisplayCompositor,SidePanelPinning,OptimizationGuideModelDownloading,OptimizationHintsFetching,OptimizationTargetPrediction,OptimizationHints",
						"--disable-popup-blocking",
						"--disable-search-engine-choice-screen",
						"--disable-infobars",
						"--disable-dev-shm-usage",
						"--disable-notifications",
						"--disable-blink-features=AutomationControlled",
					],
					headless: false,
				},
			},
		},
	],
});
