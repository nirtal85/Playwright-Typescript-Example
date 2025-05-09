import path from "node:path";
import { expect, test } from "@playwright/test";
import * as allure from "allure-js-commons";
import { DATA_PATH } from "../src/utilities/constants";
import { readExcelFile } from "../src/utilities/fileUtils";

const data = await readExcelFile(path.join(DATA_PATH, "data.xls"));

test.describe("Login flow – data driven", () => {
	for (const record of data) {
		test(`Login test for ${record.description}`, async ({ page }) => {
			await allure.parameter("username", record.user);
			await allure.parameter("password", record.password);
			await page.goto("https://www.saucedemo.com/");
			if (record.user) await page.getByTestId("username").fill(record.user);
			if (record.password)
				await page.getByTestId("password").fill(record.password);
			await page.getByTestId("login-button").click();
			await expect(page.getByTestId("error")).toHaveText(record.error);
		});
	}
});
