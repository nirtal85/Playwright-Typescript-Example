import { test as base } from './logIpOnFailure';
import { HomePage } from '../pages/HomePage';
import { MailinatorService } from '../services/MailinatorService';

interface Fixtures {
  homePage: HomePage;
  mailinatorService: MailinatorService;
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
  }
});
