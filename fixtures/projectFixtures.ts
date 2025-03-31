import { HomePage } from '../pages/HomePage';
import { MailinatorService } from '../services/MailinatorService';
import { VisualTrackerService } from '../services/VisualTrackerService';
import { test as base } from '@playwright/test';

interface Fixtures {
  homePage: HomePage;
  mailinatorService: MailinatorService;
  visualTracker: VisualTrackerService;
}

export const test = base.extend<Fixtures & { logIpOnFailure: void }>({
  logIpOnFailure: [
    async ({ request }, use, testInfo) => {
      await use();
      if (testInfo.status !== testInfo.expectedStatus) {
        const response = await request.get('https://checkip.amazonaws.com');
        const ip = await response.text();
        await testInfo.attach('IP Address', {
          body: ip.trim(),
          contentType: 'text/plain'
        });
      }
    },
    { auto: true }
  ],
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  mailinatorService: async ({}, use) => {
    const mailService = new MailinatorService(
      process.env.MAILINATOR_API_TOKEN!,
      process.env.MAILINATOR_DOMAIN
    );
    await use(mailService);
  },
  visualTracker: async ({}, use) => {
    const tracker = new VisualTrackerService();
    await tracker.start();
    await use(tracker);
    await tracker.stop();
  }
});
