/**
 * Enum for LaunchDarkly feature flag keys.
 * Provides both type safety and runtime access.
 */
export enum FeatureFlags {
  /**
   * Example Feature Flag A.
   * Replace with your actual flag keys.
   */
  EXAMPLE_FEATURE_A = 'example-feature-a'
}

/**
 * Type alias for the string literal values of the feature flags.
 * Useful for type checking function parameters.
 */
export type FeatureFlagValue = `${FeatureFlags}`;
