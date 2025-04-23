import { test } from '@playwright/test';
import axios from 'axios';
import { z } from 'zod';

const LdFlagResponseSchema = z.object({
  environments: z.record(z.string(), z.object({ on: z.boolean() }))
});

const ldApi = axios.create({
  baseURL: 'https://app.launchdarkly.com/api/v2',
  headers: {
    'Authorization': process.env.LD_TOKEN,
    'Content-Type': 'application/json'
  }
});

export class LaunchDarklyService {
  async getFlagStatus(flagKey: string, environmentKey: string = process.env.LD_ENV || 'test'): Promise<boolean> {
    const response = await ldApi.get(`/flags/default/${flagKey}`);
    const parsed = LdFlagResponseSchema.parse(response.data);
    return parsed.environments[environmentKey]?.on ?? false;
  }

  async skipTestUnlessFlagStatusIs(
    flagKey: string,
    expectedStatus: boolean,
    environmentKey: string = process.env.LD_ENV || 'test'
  ): Promise<void> {
    const actualStatus = await this.getFlagStatus(flagKey, environmentKey);
    test.skip(
      actualStatus !== expectedStatus,
      `Skipping test: flag '${flagKey}' in '${environmentKey}' is ${actualStatus}, expected ${expectedStatus}`
    );
  }
}
