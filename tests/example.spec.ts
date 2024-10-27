import { test } from '../fixtures/logIpOnFailure';
import { expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

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
