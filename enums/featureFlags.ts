/**
 * Defines constants for LaunchDarkly feature flag keys.
 * Using a const object provides runtime access to the keys
 * and allows deriving string literal types if needed.
 */
export const FeatureFlags = {
  /**
   * Example Feature Flag A.
   * Replace with your actual flag keys.
   */
  EXAMPLE_FEATURE_A: 'example-feature-a'

  // Add other feature flags here as needed, for example,
  // EXAMPLE_FEATURE_B: 'example-feature-b',

} as const;

/**
 * Optional: Define a type alias for the string literal values of the feature flags.
 * This can be useful for type checking function parameters.
 * Example Usage: function checkFlag(flag: FeatureFlagValue) { ... }
 */
export type FeatureFlagValue = typeof FeatureFlags[keyof typeof FeatureFlags];
