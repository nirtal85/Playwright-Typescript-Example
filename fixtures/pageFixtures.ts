import { test as base } from './logIpOnFailure';
import { HomePage } from '../pages/HomePage';

interface Pages {
  homePage: HomePage;
}

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  }
});
