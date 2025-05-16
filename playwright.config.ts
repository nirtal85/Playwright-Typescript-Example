import { defineConfig } from "@playwright/test";
import { config as dotenvConfig } from "dotenv";
import { AUTOMATION_USER_AGENT } from "./src/utilities/constants";

dotenvConfig();

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	timeout: 15 * 60 * 1000,
	expect: { timeout: 30 * 1000 },
	reporter: [
		[
			"allure-playwright",
			{
				links: {
					issue: { nameTemplate: "Issue #%s", urlTemplate: "https://%s" },
					tms: { nameTemplate: "TMS #%s", urlTemplate: "https://%s" },
					link: { nameTemplate: "Link #%s", urlTemplate: "https://%s" },
				},
			},
		],
		["junit", { outputFile: "test-results/results.xml" }],
	],
	use: {
		screenshot: {
			mode: process.env.CI ? "only-on-failure" : "off",
			fullPage: true,
		},
		trace: process.env.CI ? "retain-on-failure" : "off",
		video: process.env.CI ? "retain-on-failure" : "off",
	},
	projects: [
		{
			name: "chromium",
			use: {
				actionTimeout: 30 * 1000,
				navigationTimeout: 30 * 1000,
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
					headless: false,
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
				},
			},
		},
	],
});
