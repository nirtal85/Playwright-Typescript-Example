import type { ElementHandle, Page } from "@playwright/test";
import { chromium, test } from "@playwright/test";
import { PlaywrightVisualRegressionTracker } from "@visual-regression-tracker/agent-playwright";
import type { IgnoreArea } from "@visual-regression-tracker/sdk-js";
import { DIFF_TOLERANCE_PERCENT } from "../utilities/constants";

/**
 * Options used to configure a visual regression tracking action.
 */
interface TrackOptions {
	/** A list of elements to be ignored in the screenshot comparison */
	ignoreElements?: ElementHandle[];
	/** Visual difference tolerance as a percentage (0–100) */
	diffTolerancePercent?: number;
	/** Optional comment to include with the test run */
	comment?: string;
	/** Whether to capture the full page. Defaults to true */
	fullPage?: boolean;
}

/**
 * A service class that wraps the Visual Regression Tracker Playwright agent
 * and provides utility methods for tracking pages and elements with
 * advanced options like ignore areas and diff tolerance.
 *
 * By default, all <input> elements on the page are ignored during visual comparison
 * to avoid prefilled values affecting the results.
 */
export class VisualTrackerService {
	private vrt: PlaywrightVisualRegressionTracker;

	/**
	 * Creates a new instance of the VisualTrackerService.
	 */
	constructor() {
		this.vrt = new PlaywrightVisualRegressionTracker(chromium.name());
	}

	/**
	 * Starts the Visual Regression Tracker client session.
	 * This must be called before any `trackPage` or `trackElement` calls.
	 */
	async start() {
		await this.vrt.start();
	}

	/**
	 * Stops the Visual Regression Tracker client session.
	 * This should be called at the end of your test suite.
	 */
	async stop() {
		await this.vrt.stop();
	}

	/**
	 * Tracks a screenshot of the full page or current viewport for visual comparison.
	 *
	 * @param page The Playwright page object to capture.
	 * @param baseLineName Optional name to use for the baseline image.
	 * If omitted, the test title is used.
	 * @param options Optional tracking options:
	 *  - ignoreElements: Elements to ignore during comparison.
	 *  - diffTolerancePercent: Allowed visual difference threshold.
	 *  - comment: A comment for the test run.
	 *  - fullPage: Whether to capture the full page.
	 *  Defaults to true.
	 */
	async trackPage(
		page: Page,
		baseLineName?: string,
		options: TrackOptions = {},
	) {
		const {
			ignoreElements = [],
			diffTolerancePercent = DIFF_TOLERANCE_PERCENT,
			comment,
			fullPage = true,
		} = options;

		const name = baseLineName ?? test.info().title;
		const ignoreAreas: IgnoreArea[] = await this.getIgnoreAreas(
			page,
			ignoreElements,
		);
		await this.vrt.trackPage(page, name, {
			comment,
			diffTollerancePercent: diffTolerancePercent,
			ignoreAreas,
			screenshotOptions: { fullPage },
		});
	}

	/**
	 * Tracks a screenshot of a specific element for visual comparison.
	 *
	 * @param page The Playwright page object to capture.
	 * @param elementHandle The Playwright ElementHandle to capture.
	 * @param baseLineName Optional name to use for the baseline image. If omitted, the test title is used.
	 * @param options Optional tracking options:
	 *  - ignoreElements: Additional elements to ignore.
	 *  - diffTolerancePercent: Allowed visual difference threshold.
	 *  - comment: A comment for the test run.
	 */
	async trackElement(
		page: Page,
		elementHandle: ElementHandle,
		baseLineName?: string,
		options: TrackOptions = {},
	) {
		const {
			ignoreElements = [],
			diffTolerancePercent = DIFF_TOLERANCE_PERCENT,
			comment,
		} = options;
		const name = baseLineName ?? test.info().title;
		const ignoreAreas: IgnoreArea[] = await this.getIgnoreAreas(
			page,
			ignoreElements,
		);
		await this.vrt.trackElementHandle(elementHandle, name, {
			comment,
			diffTollerancePercent: diffTolerancePercent,
			ignoreAreas,
		});
	}

	/**
	 * Converts a list of ElementHandles into VRT-compatible ignore areas (bounding boxes).
	 * Includes all <input> elements on the page by default, even if not explicitly passed in.
	 *
	 * @param page The Playwright page object.
	 * @param elements A list of elements to additionally ignore.
	 * @returns A list of ignore area objects for the VRT API.
	 */
	private async getIgnoreAreas(
		page: Page,
		elements: ElementHandle[] = [],
	): Promise<IgnoreArea[]> {
		const inputElements = await page.$$("input");
		const allElements = [...elements, ...inputElements];
		return Promise.all(
			allElements.map(async (elementHandle) => {
				const box = await elementHandle.boundingBox();
				if (!box) return null;
				return {
					height: Math.ceil(box.height),
					width: Math.ceil(box.width),
					x: Math.floor(box.x),
					y: Math.floor(box.y),
				};
			}),
		).then((areas) => areas.filter((area): area is IgnoreArea => !!area));
	}
}
