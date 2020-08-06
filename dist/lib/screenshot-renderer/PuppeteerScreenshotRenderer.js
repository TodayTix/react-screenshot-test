"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppeteerScreenshotRenderer = void 0;
const chrome_1 = require("../browser/chrome");
const logger_1 = require("../logger");
const logDebug = logger_1.debugLogger("PuppeteerScreenshotRenderer");
/**
 * A screenshot renderer that uses Chrome (via Puppeteer) to take screenshots on
 * the current platform.
 */
class PuppeteerScreenshotRenderer {
    constructor() {
        this.browser = null;
    }
    async start() {
        logDebug(`start() initiated.`);
        logDebug(`Launching Chrome browser.`);
        this.browser = await chrome_1.launchChrome();
        logDebug(`Chrome browser launched.`);
    }
    async stop() {
        logDebug(`stop() initiated.`);
        if (!this.browser) {
            throw new Error("Browser is not open! Please make sure that start() was called.");
        }
        logDebug(`Closing Chrome browser.`);
        await this.browser.close();
        logDebug(`Chrome browser closed.`);
    }
    async render(name, url, viewport, cb) {
        logDebug(`render() invoked with (name = ${name}, url = ${url}).`);
        console.log(`Screenshot run for (name = ${name}, url = ${url}).`);
        if (!this.browser) {
            throw new Error("Please call start() once before render().");
        }
        const page = await this.browser.newPage();
        if (viewport) {
            await page.setViewport(viewport);
        }
        await page.goto(url);
        if (cb) {
            const parsedFunction = new Function(`return ${cb}`)();
            await parsedFunction(page);
        }
        const screenshot = await page.screenshot({
            encoding: "binary",
        });
        await page.close();
        console.log(`Screenshot run finished for (name = ${name}, url = ${url}).`);
        return screenshot;
    }
}
exports.PuppeteerScreenshotRenderer = PuppeteerScreenshotRenderer;
