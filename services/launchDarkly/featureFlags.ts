export const FeatureFlags = {
  EXAMPLE_FEATURE_A: 'example-feature-a'
} as const;

export type FeatureFlagValue = typeof FeatureFlags[keyof typeof FeatureFlags];
