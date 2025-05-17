import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { DatabaseService } from "../services/DatabaseService";
import { MailinatorService } from "../services/MailinatorService";
import { NetworkBlockerService } from "../services/NetworkBlockerService";
import { SecureApiService } from "../services/SecureApiService";
import { SftpService } from "../services/SftpService";
import { VisualTrackerService } from "../services/VisualTrackerService";
import { LaunchDarklyService } from "../services/launchDarkly/LaunchDarklyService";
import { S3Service } from "../services/s3Service";
import { StripeService } from "../services/stripe/StripeService";

interface Fixtures {
	databaseService: DatabaseService;
	homePage: HomePage;
	launchDarklyService: LaunchDarklyService;
	mailinatorService: MailinatorService;
	networkBlockerService: NetworkBlockerService;
	s3Service: S3Service;
	secureApiService: SecureApiService;
	sftpService: SftpService;
	stripeService: StripeService;
	visualTracker: VisualTrackerService;
}

export const test = base.extend<Fixtures>({
	databaseService: [
		async ({}, use) => {
			const dbService = new DatabaseService();
			await use(dbService);
			await dbService.closePool();
		},
		{ scope: "test" },
	],
	homePage: async ({ page }, use) => {
		await use(new HomePage(page));
	},
	launchDarklyService: async ({}, use) => {
		const ldService = new LaunchDarklyService();
		await use(ldService);
	},
	mailinatorService: async ({}, use) => {
		const mailService = new MailinatorService(
			process.env.MAILINATOR_API_TOKEN!,
			process.env.MAILINATOR_DOMAIN,
		);
		await use(mailService);
	},
	networkBlockerService: [
		async ({ page }, use) => {
			const networkBlocker = new NetworkBlockerService(page);
			const defaultBlockedUrls = [
				"**/analytics.dev.example.com/**",
				"**/tracking.staging.example.com/**",
				"**/thirdparty.production.example.com/**",
				"**/cdn.privacy-banner.com/**",
			];
			await networkBlocker.blockUrls(defaultBlockedUrls);
			await use(networkBlocker);
		},
		{ auto: true },
	],
	s3Service: async ({}, use) => {
		const s3 = new S3Service();
		await use(s3);
	},
	secureApiService: async ({}, use) => {
		const service = new SecureApiService();
		await use(service);
	},
	sftpService: [
		async ({}, use) => {
			const sftp = new SftpService();
			await use(sftp);
		},
		{ scope: "test" },
	],
	stripeService: async ({}, use) => {
		const stripeService = new StripeService(process.env.STRIPE_SECRET_KEY!);
		await use(stripeService);
	},
	visualTracker: async ({}, use) => {
		const tracker = new VisualTrackerService();
		await tracker.start();
		await use(tracker);
		await tracker.stop();
	},
});

test.afterEach(async ({ request, page }, testInfo) => {
	if (testInfo.status !== testInfo.expectedStatus) {
		const response = await request.get("https://checkip.amazonaws.com");
		const ip = await response.text();
		await testInfo.attach("IP Address on Failure", {
			body: ip.trim(),
			contentType: "text/plain",
		});
		const pages = page.context().pages();
		for (let i = 0; i < pages.length; i++) {
			const currentPage = pages[i];
			const url = currentPage.url();
			await testInfo.attach(`URL of window ${i}`, {
				body: url,
				contentType: "text/uri-list",
			});
		}
	}
});
