import { test } from '../fixtures/pageFixtures';
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
  async ({ page, homePage }, testInfo) => {
    await allure.severity('blocker');
    await allure.link('docs', 'Related Documentation');
    await allure.issue('issues/AUTH-123', 'Related Issue');
    await allure.tms('tms/TMS-456', 'Related Test Case');
    await allure.epic('Web interface');
    await allure.owner('John Doe');
    await allure.feature('Essential features');
    await allure.story('Authentication');
    await testInfo.attach(
      'HTML Attachment Example',
      {
        body: '<h1>Example html attachment</h1>',
        contentType: 'text/html'
      }
    );
    await testInfo.attach(
      'Text Attachment Example',
      { body: 'Some text content', contentType: 'text/plain' }
    );
    await testInfo.attach(
      'CSV Attachment Example',
      { body: 'first,second,third\none,two,three', contentType: 'text/csv' }
    );
    const filePath = path.join(Constants.DATA_PATH, 'dog.png');
    await testInfo.attach(
      'File Attachment Example',
      { body: readFileSync(filePath), contentType: 'image/png' }
    );
    await testInfo.attach(
      'JSON Attachment Example',
      { body: JSON.stringify({ first: 1, second: 2 }, null, 2), contentType: 'application/json' }
    );
    const xmlContent // language=xml
        = `<?xml version="1.0" encoding="UTF-8"?>
            <tag>
                <inside>...</inside>
            </tag>
            `;
    await testInfo.attach(
      'XML Attachment Example',
      { body: xmlContent, contentType: 'application/xml' }
    );
    await testInfo.attach(
      'URI List Attachment Example',
      {
        body: ['https://github.com/allure-framework', 'https://github.com/allure-examples'].join('\n'),
        contentType: 'text/uri-list'
      }
    );
    await test.step('Navigate to the base URL', async () => {
      await page.goto('/');
    });
    await test.step('Click the "Get started" link', async () => {
      await homePage.clickGetStarted();
    });
    await test.step('Verify heading visibility', async () => {
      await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
    });
  }
);
