import { test } from '../fixtures/logIpOnFailure';
import { expect } from '@playwright/test';
import { link, issue, tms, severity } from 'allure-js-commons';
import { allure } from 'allure-playwright';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test(
  'get started link',
  {
    tag: '@devRun',
  },
  async ({ page }) => {
    //Specify description, links and other metadata
    severity('blocker');
    link('https://example.com/docs', 'Related Documentation');
    issue('https://example.com/issues/AUTH-123', 'Related Issue');
    tms('https://example.com/tms/TMS-456', 'Related Test Case');
    //Organize tests
    allure.epic('Web interface');
    allure.owner('John Doe');
    allure.feature('Essential features');
    allure.story('Authentication');
    await page.goto('/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Get started' }).click();

    // Expects page to have a heading with the name of Installation.
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  },
);
