import {Constants} from '../utilities/constants';
import {FileUtils} from '../utilities/fileUtils';
import {expect, test} from '@playwright/test';
import * as allure from 'allure-js-commons';
import path from 'node:path';

const data = await FileUtils.readExcelFile(
    path.join(Constants.DATA_PATH, 'data.xls'),
);

test.describe('Login flow – data driven', () => {
  for (const record of data) {
    test(`Login test for ${record.description}`, async ({page}) => {
      await allure.parameter('username', record.user);
      await allure.parameter('password', record.password);
      await page.goto('https://www.saucedemo.com/');
      if (record.user) await page.getByTestId('username').fill(record.user);
      if (record.password) await page.getByTestId('password').fill(record.password);
      await page.getByTestId('login-button').click();
      await expect(page.getByTestId('error')).toHaveText(record.error);
    });
  }
});
