import { Constants } from './utilities/constants';
import { defineConfig } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    [
      'allure-playwright',
      {
        links: {
          issue: {
            nameTemplate: 'Issue #%s',
            urlTemplate: 'https://example.com/%s'
          },
          tms: {
            nameTemplate: 'TMS #%s',
            urlTemplate: 'https://example.com/%s'
          },
          link: {
            nameTemplate: 'Link #%s',
            urlTemplate: 'https://example.com/%s'
          }
        }
      }
    ]
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        viewport: null,
        testIdAttribute: 'data-test',
        userAgent: Constants.AUTOMATION_USER_AGENT,
        // Set the storage state here if you have only one user to login.
        // storageState: STORAGE_STATE_LOGIN,
        launchOptions: {
          args: ['--disable-web-security', '--start-maximized'],
          headless: false
        }
      }
    }
  ]
});
