import { test } from '@playwright/test'; // Import test for test.skip

/**
 * Interface representing the structure of a single environment within a LaunchDarkly flag response.
 */
interface LdFlagEnvironment {
  /** Whether the flag is enabled ('on') for this environment. */
  on: boolean;
}

/**
 * Interface representing the expected structure of the LaunchDarkly flag API response.
 */
interface LdFlagResponse {
  /** A map of environment keys to their specific flag configurations. */
  environments: {
    [key: string]: LdFlagEnvironment;
  };
}

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
   *
   * Use FeatureFlags constants when calling this method.
   * @param {string} flagKey The unique key of the feature flag (e.g., 'my-new-feature'). Should be a value from FeatureFlags.
   * @param {string} [environmentKey='test'] The key of the target environment (e.g., 'test', 'production').
   * @returns {Promise<boolean>} A promise that resolves to `true` if the flag is 'on' for the environment,
   *                            `false` otherwise (including if the flag or environment key is not found in the response).
   * @throws {Error} If the API request fails (e.g., network error, invalid token, non-2xx response).
   */
  async getFlagStatus(flagKey: string, environmentKey: string = 'test'): Promise<boolean> {
    const apiUrl = `${this.baseUrl}/flags/default/${flagKey}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': this.ldToken,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`LaunchDarkly API request failed for flag '${flagKey}': ${response.status} ${response.statusText}`);
    }
    const data: LdFlagResponse = await response.json();
    const environmentData = data.environments?.[environmentKey];
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
   * @throws {Error} If the underlying API call to LaunchDarkly fails (e.g., network error, invalid token).
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
