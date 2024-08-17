import { test, expect } from '@playwright/test';
import { link, issue, tms } from 'allure-js-commons';
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
    allure.severity('blocker');
    link('https://playwright.dev', 'link-type', 'playwright-site'); // link with name and type
    issue('Issue Name', '352');
    tms('Task Name', '352');
    //Organize tests
    allure.epic('Web interface');
    allure.feature('Essential features');
    allure.story('Authentication');
    await page.goto('https://playwright.dev/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Get started' }).click();

    // Expects page to have a heading with the name of Installation.
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  },
);
