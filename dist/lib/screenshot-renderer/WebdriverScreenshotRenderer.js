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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeleniumScreenshotRenderer = void 0;
const selenium_standalone_1 = __importDefault(require("selenium-standalone"));
const webdriverio = __importStar(require("webdriverio"));
const logger_1 = require("../logger");
const logDebug = logger_1.debugLogger("SeleniumScreenshotRenderer");
/**
 * A screenshot renderer that uses a browser controlled by Selenium to take
 * screenshots on the current platform.
 */
class SeleniumScreenshotRenderer {
    constructor(capabilities) {
        this.capabilities = capabilities;
        this.seleniumProcess = null;
        this.browser = null;
    }
    async start() {
        logDebug(`start() initiated.`);
        logDebug(`Ensuring that Selenium is installed.`);
        await new Promise((resolve) => {
            selenium_standalone_1.default.install(resolve);
        });
        logDebug(`Selenium is installed.`);
        logDebug(`Starting Selenium server.`);
        this.seleniumProcess = await new Promise((resolve, reject) => selenium_standalone_1.default.start((error, childProcess) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(childProcess);
            }
        }));
        logDebug(`Selenium server started.`);
        logDebug(`Launching browser.`);
        this.browser = await webdriverio.remote({
            capabilities: this.capabilities,
            logLevel: "warn",
        });
        logDebug(`Browser launched.`);
    }
    async stop() {
        logDebug(`stop() initiated.`);
        if (!this.browser) {
            throw new Error("Browser is not open! Please make sure that start() was called.");
        }
        // @ts-ignore
        await this.browser.closeWindow();
        if (this.seleniumProcess) {
            // Kill Selenium server.
            await this.seleniumProcess.kill();
        }
    }
    async render(name, url, viewport) {
        logDebug(`render() invoked with (name = ${name}, url = ${url}).`);
        if (!this.browser) {
            throw new Error("Please call start() once before render().");
        }
        if (viewport) {
            this.browser.setWindowSize(viewport.isLandscape ? viewport.height : viewport.width, viewport.isLandscape ? viewport.width : viewport.height);
        }
        // @ts-ignore
        await this.browser.navigateTo(url);
        // @ts-ignore
        return Buffer.from(await this.browser.takeScreenshot(), "base64");
    }
}
exports.SeleniumScreenshotRenderer = SeleniumScreenshotRenderer;
