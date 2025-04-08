import { test } from '@playwright/test';

/**
 * Defines constants for known execution environments.
 */
export const Environment = {
  DEV: 'DEV',
  CANARY: 'CANARY',
  PROD: 'PROD'
} as const;

/**
 * Type alias for the string literal values of the environments.
 * Useful for type-checking function parameters.
 */
export type EnvironmentValue = typeof Environment[keyof typeof Environment];
const currentEnv = (process.env.DOMAIN || Environment.DEV).toLowerCase() as EnvironmentValue;

/**
 * Checks if the current execution environment matches the specified environment.
 * Reads the current environment from the `DOMAIN` environment variable (defaults to 'DEV').
 * Comparison is case-insensitive.
 *
 * @param {EnvironmentValue} targetEnvironment The environment to check against (e.g., Environments.DEV).
 * @returns {boolean} True if the current environment matches the target, false otherwise.
 */
export function isEnvironment(targetEnvironment: EnvironmentValue): boolean {
  return currentEnv === targetEnvironment.toLowerCase();
}

/**
 * Skips the current Playwright test unless the execution environment matches the specified environment.
 * Must be called early within a Playwright test function.
 *
 * @param {EnvironmentValue} requiredEnvironment The environment the test is required to run in.
 */
export function skipTestUnlessEnvironmentIs(
  requiredEnvironment: EnvironmentValue
): void {
  const shouldSkip = !isEnvironment(requiredEnvironment);
  test.skip(shouldSkip, `Skipping test because current environment '${currentEnv}' is not the required environment '${requiredEnvironment.toLowerCase()}'.`);
}
