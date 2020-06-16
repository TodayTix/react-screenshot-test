import { Browser, launchChrome } from "../browser/chrome";
import { ScreenshotRenderer, Viewport } from "./api";
import { debugLogger } from "../logger";

export interface Settings {
  viewport?: Viewport;
  awaitTime?: number;
  waitUntilResponses?: string[];
}

const logDebug = debugLogger("PuppeteerScreenshotRenderer");

/**
 * A screenshot renderer that uses Chrome (via Puppeteer) to take screenshots on
 * the current platform.
 */
export class PuppeteerScreenshotRenderer implements ScreenshotRenderer {
  private browser: Browser | null = null;

  async start() {
    logDebug(`start() initiated.`);

    logDebug(`Launching Chrome browser.`);
    this.browser = await launchChrome();
    logDebug(`Chrome browser launched.`);
  }

  async stop() {
    logDebug(`stop() initiated.`);

    if (!this.browser) {
      throw new Error(
        "Browser is not open! Please make sure that start() was called."
      );
    }
    logDebug(`Closing Chrome browser.`);
    await this.browser.close();
    logDebug(`Chrome browser closed.`);
  }

  async render(name: string, url: string, settings: Settings = {}) {
    const { awaitTime, viewport, waitUntilResponses } = settings;

    console.log(`render() invoked with (name = ${name}, url = ${url}).`);
    logDebug(`render() invoked with (name = ${name}, url = ${url}).`);

    if (!this.browser) {
      throw new Error("Please call start() once before render().");
    }
    const page = await this.browser.newPage();
    page.setDefaultTimeout(100000);

    if (viewport) {
      await page.setViewport(viewport);
    }

    await page.goto(url);

    if (waitUntilResponses && waitUntilResponses.length) {
      const promiseCollection: Promise<any>[] = [];

      waitUntilResponses.forEach((expectedUrlResponseAwait) => {
        promiseCollection.push(page.waitForResponse(expectedUrlResponseAwait));
      });

      await Promise.all(promiseCollection).catch((err) => console.log(err));
    }

    if (awaitTime) {
      await page.waitFor(awaitTime);
    }

    const screenshot = await page.screenshot({
      encoding: "binary",
      omitBackground: true,
    });
    await page.close();
    return screenshot;
  }
}
