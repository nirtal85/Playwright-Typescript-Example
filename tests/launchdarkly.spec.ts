import { expect } from "@playwright/test";
import { test } from "../fixtures/projectFixtures";
import { FeatureFlags } from "../services/launchDarkly/featureFlags";

test.describe("LaunchDarkly Service", () => {
	test.skip("should fetch status for a known feature flag", async ({
		launchDarklyService,
	}) => {
		const flagKey = FeatureFlags.EXAMPLE_FEATURE_A;
		const environmentKey = "test";
		const isOn = await launchDarklyService.getFlagStatus(
			flagKey,
			environmentKey,
		);
		expect(isOn).toBe(true);
	});
});
