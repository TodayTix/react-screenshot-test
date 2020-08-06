"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PercyScreenshotRenderer = void 0;
const chrome_1 = require("../browser/chrome");
const logger_1 = require("../logger");
const logDebug = logger_1.debugLogger("PercyScreenshotRenderer");
/**
 * A screenshot renderer that uses Percy to take and compare screenshots.
 */
class PercyScreenshotRenderer {
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
        if (this.browser) {
            logDebug(`Closing Chrome browser.`);
            await this.browser.close();
            logDebug(`Chrome browser closed.`);
        }
        else {
            logDebug(`No Chrome browser found.`);
        }
    }
    async render(name, url, viewport) {
        logDebug(`render() invoked with (name = ${name}, url = ${url}).`);
        if (!this.browser) {
            throw new Error("Browser was not launched successfully.");
        }
        const page = await this.browser.newPage();
        await page.goto(url);
        let percy;
        try {
            percy = await Promise.resolve().then(() => __importStar(require("@percy/puppeteer")));
        }
        catch (e) {
            throw new Error(`Please install the '@percy/puppeteer' package:
    
    Using NPM:
    $ npm install -D @percy/puppeteer
    
    Using Yarn:
    $ yarn add -D @percy/puppeteer`);
        }
        await percy.percySnapshot(page, name, viewport && {
            widths: [viewport.width / (viewport.deviceScaleFactor || 1)],
        });
        return null;
    }
}
exports.PercyScreenshotRenderer = PercyScreenshotRenderer;
