"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoggingLevel = exports.getScreenshotPrefix = exports.getSeleniumBrowser = exports.SCREENSHOT_MODE = exports.SCREENSHOT_SERVER_URL = exports.SCREENSHOT_SERVER_PORT = void 0;
const is_docker_1 = __importDefault(require("is-docker"));
exports.SCREENSHOT_SERVER_PORT = parseInt(process.env.SCREENSHOT_SERVER_PORT || "3038", 10);
exports.SCREENSHOT_SERVER_URL = process.env.SCREENSHOT_SERVER_URL ||
    `http://localhost:${exports.SCREENSHOT_SERVER_PORT}`;
exports.SCREENSHOT_MODE = getScreenshotMode();
function getScreenshotMode() {
    if (process.env.SCREENSHOT_MODE) {
        switch (process.env.SCREENSHOT_MODE) {
            case "local":
            case "puppeteer":
                return "puppeteer";
            case "selenium":
            case "docker":
            case "percy":
                return process.env.SCREENSHOT_MODE;
            default:
                throw new Error(`Valid values for SCREENSHOT_MODE are 'puppeteer', 'selenium', 'docker' and 'percy'. Received '${process.env.SCREENSHOT_MODE}'.`);
        }
    }
    return is_docker_1.default() ? "puppeteer" : "docker";
}
function getSeleniumBrowser() {
    const browser = process.env.SCREENSHOT_SELENIUM_BROWSER;
    if (!browser) {
        throw new Error(`Please set SCREENSHOT_SELENIUM_BROWSER. Valid values are "chrome", "firefox", "internet explorer", "opera" or "safari".`);
    }
    return browser;
}
exports.getSeleniumBrowser = getSeleniumBrowser;
function getScreenshotPrefix() {
    return process.env.SCREENSHOT_PREFIX || "";
}
exports.getScreenshotPrefix = getScreenshotPrefix;
function getLoggingLevel() {
    return (process.env.SCREENSHOT_LOGGING_LEVEL || "").toLowerCase() === "debug"
        ? "DEBUG"
        : "NORMAL";
}
exports.getLoggingLevel = getLoggingLevel;
