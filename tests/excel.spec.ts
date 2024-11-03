import { Constants } from '../utilities/constants';
import { expect, test } from '@playwright/test';
import xlsx from 'xlsx';
import path from 'path';

/**
 * Reads data from an Excel file and converts it to a JSON array.
 * @param {string} filePath - The path to the Excel file.
 * @returns {Promise<{ [key: string]: any }[]>} - A promise that resolves to an array of JSON objects representing the data in the Excel file.
 */
export const readExcelFile = async (filePath: string): Promise<{ [key: string]: any }[]> => {
  const file = xlsx.readFile(filePath);
  const data: any[] = [];
  const sheets = file.SheetNames;
  for (let i = 0; i < sheets.length; i++) {
    const sheetData = xlsx.utils.sheet_to_json(file.Sheets[sheets[i]]);
    data.push(...sheetData);
  }
  return data;
};

const data = await readExcelFile(path.join(Constants.DATA_PATH, 'data.xls'));

data.forEach((record) => {
  test(`Login test for ${record.description}`, async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    if (record.user !== undefined) {
      await page.fill('input[data-test="username"]', record.user);
    }
    if (record.password !== undefined) {
      await page.fill('input[data-test="password"]', record.password);
    }
    await page.click('input[data-test="login-button"]');
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toHaveText(record.error);
  });
});
