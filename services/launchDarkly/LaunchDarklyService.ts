import { test } from '@playwright/test';
import axios from 'axios';
import { z } from 'zod';

const LdFlagResponseSchema = z.object({
  environments: z.record(z.string(), z.object({
    on: z.boolean()
  }))
});

/**
 * Service class for interacting with the LaunchDarkly REST API.
 * Reads the required API token from the LD_TOKEN environment variable.
 */
export class LaunchDarklyService {
  private readonly ldToken: string;
  private readonly baseUrl = 'https://app.launchdarkly.com/api/v2';

  /**
   * Initializes the service, ensuring the LD_TOKEN environment variable is set.
   * @throws Error if LD_TOKEN environment variable is missing.
   */
  constructor() {
    const token = process.env.LD_TOKEN;
    if (!token) {
      throw new Error('Missing required environment variable: LD_TOKEN');
    }
    this.ldToken = token;
  }

  /**
   * Fetches the boolean status ('on') of a specific feature flag for a given environment from the LaunchDarkly API.
   * Validates the API response structure using Zod.
   *
   * Use FeatureFlags constants when calling this method.
   * @param {string} flagKey The unique key of the feature flag.
   * @param {string} [environmentKey='test'] The key of the target environment.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the flag is 'on', `false` otherwise.
   */
  async getFlagStatus(flagKey: string, environmentKey: string = 'test'): Promise<boolean> {
    const apiUrl = `${this.baseUrl}/flags/default/${flagKey}`;
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': this.ldToken,
        'Content-Type': 'application/json'
      }
    });
    const parsedData = LdFlagResponseSchema.parse(response.data);
    const environmentData = parsedData.environments[environmentKey];
    return environmentData?.on ?? false;
  }

  /**
   * Checks the status of a LaunchDarkly feature flag and skips the current Playwright test
   * if the status doesn't match the expected value.
   * Must be called early within a Playwright test function.
   *
   * Use FeatureFlags constants when calling this method.
   * @param {string} flagKey The key of the feature flag to check.
   * @param {boolean} expectedStatus The desired boolean status (true for enabled, false for disabled).
   * @param {string} [environmentKey='test'] Optional: The specific environment key to check.
   * @throws {Error} If the underlying API call or validation fails.
   */
  async skipTestUnlessFlagStatusIs(
    flagKey: string,
    expectedStatus: boolean,
    environmentKey: string = 'test'
  ): Promise<void> {
    let actualStatus: boolean;
    try {
      actualStatus = await this.getFlagStatus(flagKey, environmentKey);
    } catch (error: any) {
      throw new Error(`Failed to get LaunchDarkly flag status for '${flagKey}' in environment '${environmentKey}': ${error.message}`);
    }
    const shouldSkip = actualStatus !== expectedStatus;
    const skipMessage = `Skipping test because flag '${flagKey}' in environment '${environmentKey}' is ${actualStatus}, but expected ${expectedStatus}.`;
    test.skip(shouldSkip, skipMessage);
  }
}
