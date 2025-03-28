import { Constants } from '../utilities/constants';
import {
  PlaywrightVisualRegressionTracker
} from '@visual-regression-tracker/agent-playwright';
import { type Page, type ElementHandle, chromium } from '@playwright/test';
import { type IgnoreArea } from '@visual-regression-tracker/sdk-js';

/**
 * Options used to configure a visual regression tracking action.
 */
interface TrackOptions {
  /** Optional custom baseline name. Defaults to "Default baseline" */
  baselineName?: string;

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
   * @param baseLineName The name to use for the baseline image.
   * @param options Optional tracking options:
   *  - baselineName: Custom name for the baseline image.
   *  - ignoreElements: Elements to ignore during comparison.
   *  - diffTolerancePercent: Allowed visual difference threshold.
   *  - comment: A comment for the test run.
   *  - fullPage: Whether to capture the full page. Defaults to true.
   */
  async trackPage(page: Page, baseLineName: string, options: TrackOptions = {}) {
    const {
      ignoreElements = [],
      diffTolerancePercent = Constants.DIFF_TOLERANCE_PERCENT,
      comment,
      fullPage = true
    } = options;

    const ignoreAreas: IgnoreArea[] = await this.getIgnoreAreas(ignoreElements);

    await this.vrt.trackPage(
      page,
      baseLineName,
      {
        diffTollerancePercent: diffTolerancePercent,
        ignoreAreas,
        comment,
        screenshotOptions: { fullPage }
      }
    );
  }

  /**
   * Tracks a screenshot of a specific element for visual comparison.
   *
   * @param elementHandle The Playwright ElementHandle to capture.
   * @param baseLineName The name to use for the baseline image.
   * @param options Optional tracking options:
   *  - ignoreElements: Additional elements to ignore.
   *  - diffTolerancePercent: Allowed visual difference threshold.
   *  - comment: A comment for the test run.
   */
  async trackElement(elementHandle: ElementHandle, baseLineName: string, options: TrackOptions = {}) {
    const {
      ignoreElements = [],
      diffTolerancePercent = Constants.DIFF_TOLERANCE_PERCENT,
      comment
    } = options;

    const ignoreAreas: IgnoreArea[] = await this.getIgnoreAreas(ignoreElements);

    await this.vrt.trackElementHandle(
      elementHandle,
      baseLineName,
      {
        diffTollerancePercent: diffTolerancePercent,
        ignoreAreas,
        comment
      }
    );
  }

  /**
   * Converts a list of ElementHandles into VRT-compatible ignore areas (bounding boxes).
   *
   * @param elements A list of elements to ignore.
   * @returns A list of ignore area objects for the VRT API.
   */
  private async getIgnoreAreas(elements: ElementHandle[]): Promise<IgnoreArea[]> {
    return Promise.all(
      elements.map(async (el) => {
        const box = await el.boundingBox();
        if (!box) return null;
        return {
          x: Math.floor(box.x),
          y: Math.floor(box.y),
          width: Math.ceil(box.width),
          height: Math.ceil(box.height)
        };
      })
    ).then(areas => areas.filter((area): area is IgnoreArea => !!area));
  }
}
