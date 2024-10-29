import { test as base } from '@playwright/test';

export const test = base.extend<{ logIpOnFailure: void }>({
  logIpOnFailure: [
    async ({ request }, use, testInfo) => {
      await use();
      if (testInfo.status !== testInfo.expectedStatus) {
        const response = await request.get('https://checkip.amazonaws.com');
        const ip = await response.text();

        testInfo.attach(
          'IP Address',
          { body: ip.trim(), contentType: 'text/plain' }
        );
      }
    },
    { auto: true }
  ]
});
