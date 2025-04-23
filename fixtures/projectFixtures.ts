import { HomePage } from '../pages/HomePage';
import { MailinatorService } from '../services/MailinatorService';
import { VisualTrackerService } from '../services/VisualTrackerService';
import { DatabaseService } from '../services/DatabaseService';
import { StripeService } from '../services/stripe/StripeService';
import { LaunchDarklyService } from '../services/launchDarkly/LaunchDarklyService';
import { SftpService } from '../services/SftpService';
import { SecureApiService } from '../services/SecureApiService';
import { NetworkBlockerService } from '../services/NetworkBlockerService';
import { test as base } from '@playwright/test';

interface Fixtures {
  homePage: HomePage;
  mailinatorService: MailinatorService;
  visualTracker: VisualTrackerService;
  databaseService: DatabaseService;
  stripeService: StripeService;
  launchDarklyService: LaunchDarklyService;
  sftpService: SftpService;
  secureApiService: SecureApiService;
}

export const test = base.extend<Fixtures>({
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
  },
  launchDarklyService: async ({}, use) => {
    const ldService = new LaunchDarklyService();
    await use(ldService);
  },
  sftpService: [async ({}, use) => {
    const sftp = new SftpService();
    await use(sftp);
  }, { scope: 'test' }],
  secureApiService: async ({}, use) => {
    const service = new SecureApiService();
    await use(service);
  }
});

test.beforeEach(async ({ page }) => {
  const networkBlocker = new NetworkBlockerService(page);
  const defaultBlockedUrls = [
    'https://analytics.dev.example.com/*',
    'https://tracking.staging.example.com/*',
    'https://thirdparty.production.example.com/*',
    'https://cdn.privacy-banner.com/*'
  ];
  await networkBlocker.blockUrls(defaultBlockedUrls);
});

test.afterEach(async ({ request }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const response = await request.get('https://checkip.amazonaws.com');
    const ip = await response.text();
    await testInfo.attach('IP Address on Failure', {
      body: ip.trim(),
      contentType: 'text/plain'
    });
  }
});
