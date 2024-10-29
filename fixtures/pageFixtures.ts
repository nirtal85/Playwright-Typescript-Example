import { test as base } from './logIpOnFailure';
import { HomePage } from '../pages/HomePage ';

interface pages {
  homePage: HomePage;
}

export const test = base.extend<pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  }
});
