import { test } from '../fixtures/logIpOnFailure';
import { Constants } from '../utilities/constants';
import { expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import path from 'path';
import { readFileSync } from 'fs';

test('has title', async ({ page }) => {
  await test.step('Navigate to Playwright website', async () => {
    await page.goto('https://playwright.dev/');
  });

  await test.step('Check page title', async () => {
    await expect(page).toHaveTitle(/Playwright/);
  });
});

test(
  'get started link',
  {
    tag: '@devRun'
  },
  async ({ page }) => {
    allure.severity('blocker');
    allure.link('docs', 'Related Documentation');
    allure.issue('issues/AUTH-123', 'Related Issue');
    allure.tms('tms/TMS-456', 'Related Test Case');
    allure.epic('Web interface');
    allure.owner('John Doe');
    allure.feature('Essential features');
    allure.story('Authentication');

    allure.attachment(
      'HTML Attachment Example',
      '<h1>Example html attachment</h1>',
      'text/html'
    );

    allure.attachment(
      'Text Attachment Example',
      'Some text content',
      'text/plain'
    );

    allure.attachment(
      'CSV Attachment Example',
      'first,second,third\none,two,three',
      'text/csv'
    );

    const filePath = path.join(Constants.DATA_PATH, 'dog.png');
    allure.attachment(
      'File Attachment Example',
      readFileSync(filePath),
      'image/png'
    );

    allure.attachment(
      'JSON Attachment Example',
      JSON.stringify({ first: 1, second: 2 }, null, 2),
      'application/json'
    );

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<tag>
    <inside>...</inside>
</tag>
`;
    allure.attachment(
      'XML Attachment Example',
      xmlContent,
      'application/xml'
    );

    allure.attachment(
      'URI List Attachment Example',
      [
        'https://github.com/allure-framework',
        'https://github.com/allure-examples'
      ].join('\n'),
      'text/uri-list'
    );

    await test.step('Navigate to the base URL', async () => {
      await page.goto('/');
    });

    await test.step('Click the "Get started" link', async () => {
      await page.getByRole('link', { name: 'Get started' }).click();
    });

    await test.step('Verify heading visibility', async () => {
      await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
    });
  }
);
