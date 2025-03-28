import { test as base } from './logIpOnFailure';
import { HomePage } from '../pages/HomePage';
import { MailinatorService } from '../services/MailinatorService';
import { VisualTrackerService } from '../services/VisualTrackerService';

interface Fixtures {
  homePage: HomePage;
  mailinatorService: MailinatorService;
  visualTracker: VisualTrackerService;
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
  }
});
