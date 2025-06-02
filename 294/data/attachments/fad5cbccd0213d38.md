# Test info

- Name: get started link
- Location: /__w/Playwright-Typescript-Example/Playwright-Typescript-Example/tests/example.spec.ts:17:1

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/", waiting until "load"

    at /__w/Playwright-Typescript-Example/Playwright-Typescript-Example/tests/example.spec.ts:71:15
    at /__w/Playwright-Typescript-Example/Playwright-Typescript-Example/tests/example.spec.ts:70:14
```

# Test source

```ts
   1 | import { readFileSync } from "node:fs";
   2 | import path from "node:path";
   3 | import { expect } from "@playwright/test";
   4 | import * as allure from "allure-js-commons";
   5 | import { test } from "../src/fixtures/projectFixtures";
   6 | import { DATA_PATH } from "../src/utilities/constants";
   7 |
   8 | test("has title", async ({ page }) => {
   9 | 	await test.step("Navigate to Playwright website", async () => {
  10 | 		await page.goto("https://playwright.dev/");
  11 | 	});
  12 | 	await test.step("Check page title", async () => {
  13 | 		await expect(page).toHaveTitle(/Playwright/);
  14 | 	});
  15 | });
  16 |
  17 | test(
  18 | 	"get started link",
  19 | 	{
  20 | 		tag: "@devRun",
  21 | 	},
  22 | 	async ({ page, homePage }, testInfo) => {
  23 | 		await allure.severity(allure.Severity.BLOCKER);
  24 | 		await allure.link("docs", "Related Documentation");
  25 | 		await allure.issue("issues/AUTH-123", "Related Issue");
  26 | 		await allure.tms("tms/TMS-456", "Related Test Case");
  27 | 		await allure.epic("Web interface");
  28 | 		await allure.owner("John Doe");
  29 | 		await allure.feature("Essential features");
  30 | 		await allure.story("Authentication");
  31 | 		await testInfo.attach("HTML Attachment Example", {
  32 | 			body: "<h1>Example html attachment</h1>",
  33 | 			contentType: "text/html",
  34 | 		});
  35 | 		await testInfo.attach("Text Attachment Example", {
  36 | 			body: "Some text content",
  37 | 			contentType: "text/plain",
  38 | 		});
  39 | 		await testInfo.attach("CSV Attachment Example", {
  40 | 			body: "first,second,third\none,two,three",
  41 | 			contentType: "text/csv",
  42 | 		});
  43 | 		const filePath = path.join(DATA_PATH, "dog.png");
  44 | 		await testInfo.attach("File Attachment Example", {
  45 | 			body: readFileSync(filePath),
  46 | 			contentType: "image/png",
  47 | 		});
  48 | 		await testInfo.attach("JSON Attachment Example", {
  49 | 			body: JSON.stringify({ first: 1, second: 2 }, null, 2),
  50 | 			contentType: "application/json",
  51 | 		});
  52 | 		const xmlContent =
  53 | 			// language=xml
  54 | 			`<?xml version="1.0" encoding="UTF-8"?>
  55 |             <tag>
  56 |                 <inside>...</inside>
  57 |             </tag>
  58 |             `;
  59 | 		await testInfo.attach("XML Attachment Example", {
  60 | 			body: xmlContent,
  61 | 			contentType: "application/xml",
  62 | 		});
  63 | 		await testInfo.attach("URI List Attachment Example", {
  64 | 			body: [
  65 | 				"https://github.com/allure-framework",
  66 | 				"https://github.com/allure-examples",
  67 | 			].join("\n"),
  68 | 			contentType: "text/uri-list",
  69 | 		});
  70 | 		await test.step("Navigate to the base URL", async () => {
> 71 | 			await page.goto("/");
     | 			           ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  72 | 		});
  73 | 		await test.step('Click the "Get started" link', async () => {
  74 | 			await homePage.clickGetStarted();
  75 | 		});
  76 | 		await test.step("Verify heading visibility", async () => {
  77 | 			await expect(
  78 | 				page.getByRole("heading", { name: "Installation" }),
  79 | 			).toBeVisible();
  80 | 		});
  81 | 	},
  82 | );
  83 |
```