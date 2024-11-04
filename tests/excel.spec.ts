import { Constants } from '../utilities/constants';
import { FileUtils } from '../utilities/fileUtils';
import { expect, test } from '@playwright/test';
import path from 'path';

const data = await FileUtils.readExcelFile(path.join(Constants.DATA_PATH, 'data.xls'));

data.forEach((record) => {
  test(`Login test for ${record.description}`, async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    if (record.user) {
      await page.fill('input[data-test="username"]', record.user);
    }
    if (record.password) {
      await page.fill('input[data-test="password"]', record.password);
    }
    await page.click('input[data-test="login-button"]');
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toHaveText(record.error);
  });
});
