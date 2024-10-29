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
  async ({ page }, testInfo) => {
    allure.severity('blocker');
    allure.link('docs', 'Related Documentation');
    allure.issue('issues/AUTH-123', 'Related Issue');
    allure.tms('tms/TMS-456', 'Related Test Case');
    allure.epic('Web interface');
    allure.owner('John Doe');
    allure.feature('Essential features');
    allure.story('Authentication');

    testInfo.attach(
      'HTML Attachment Example',
      { body: '<h1>Example html attachment</h1>',
        contentType: 'text/html'
      }
    );

    testInfo.attach(
      'Text Attachment Example',
      { body: 'Some text content', contentType: 'text/plain' }
    );

    testInfo.attach(
      'CSV Attachment Example',
      { body: 'first,second,third\none,two,three', contentType: 'text/csv' }
    );

    const filePath = path.join(Constants.DATA_PATH, 'dog.png');
    testInfo.attach(
      'File Attachment Example',
      { body: readFileSync(filePath), contentType: 'image/png' }
    );

    testInfo.attach(
      'JSON Attachment Example',
      { body: JSON.stringify({ first: 1, second: 2 }, null, 2), contentType: 'application/json' }
    );

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<tag>
    <inside>...</inside>
</tag>
`;
    testInfo.attach(
      'XML Attachment Example',
      { body: xmlContent, contentType: 'application/xml' }
    );

    testInfo.attach(
      'URI List Attachment Example',
      { body: ['https://github.com/allure-framework', 'https://github.com/allure-examples'].join('\n'), contentType: 'text/uri-list' }
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
