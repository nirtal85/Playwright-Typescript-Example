import { test, expect } from '@playwright/test';
import { label, link, issue, tms } from 'allure-js-commons';
import { allure } from 'allure-playwright';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test(
  'get started link @allure.label.severity=critical',
  {
    tag: '@devRun',
  },
  async ({ page }) => {
    await allure.epic('Some Epic');
    await allure.story('Some Story');
    await label('labelName', 'labelValue');
    await link('https://playwright.dev', 'link-type', 'playwright-site'); // link with name and type
    await issue('Issue Name', '352');
    await tms('Task Name', '352');
    await link('352', 'Link name', 'custom');
    await issue('Issue Name', 'https://github.com/allure-framework/allure-js/issues/352');
    await page.goto('https://playwright.dev/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Get started' }).click();

    // Expects page to have a heading with the name of Installation.
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  },
);
