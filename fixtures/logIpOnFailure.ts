import { test as base } from '@playwright/test';
import { allure } from 'allure-playwright';

export const test = base.extend<{ logIpOnFailure: void }>({
  logIpOnFailure: [
    async ({ request }, use, testInfo) => {
      await use();
      if (testInfo.status !== testInfo.expectedStatus) {
        const response = await request.get('https://checkip.amazonaws.com');
        const ip = await response.text();
        allure.attachment('IP Address', ip.trim(), 'text/plain');
      }
    },
    { auto: true },
  ],
});
