import { HomePage } from '../pages/HomePage';
import { MailinatorService } from '../services/MailinatorService';
import { VisualTrackerService } from '../services/VisualTrackerService';
import { DatabaseService } from '../services/DatabaseService';
import { StripeService } from '../services/StripeService';
import { type CDPSession, test as base } from '@playwright/test';

interface Fixtures {
  homePage: HomePage;
  mailinatorService: MailinatorService;
  visualTracker: VisualTrackerService;
  databaseService: DatabaseService;
  stripeService: StripeService;
}

export const test = base.extend<
  Fixtures & {
    logIpOnFailure: void;
    cdp: CDPSession;
  }
>({
  cdp: async ({ page }, use) => {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.setBlockedURLs', {
      urls: [
        'https://analytics.dev.example.com/*',
        'https://tracking.staging.example.com/*',
        'https://thirdparty.production.example.com/*',
        'https://cdn.privacy-banner.com/*'
      ]
    });
    await use(client);
  },
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
  },
  databaseService: [async ({}, use) => {
    const dbService = new DatabaseService();
    await use(dbService);
    await dbService.closePool();
  }, { scope: 'test' }],
  stripeService: async ({}, use) => {
    const stripeService = new StripeService(process.env.STRIPE_SECRET_KEY!);
    await use(stripeService);
  }
});

test.beforeEach(async ({ cdp }, testInfo) => {
  if (testInfo.tags.includes('@unblock')) {
    await cdp.send('Network.setBlockedURLs', { urls: [] });
  }
});
