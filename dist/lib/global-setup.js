"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpScreenshotServer = exports.getScreenshotServer = void 0;
const assert_never_1 = __importDefault(require("assert-never"));
const chalk_1 = __importDefault(require("chalk"));
const constants_1 = require("./constants");
const PercyScreenshotRenderer_1 = require("./screenshot-renderer/PercyScreenshotRenderer");
const PuppeteerScreenshotRenderer_1 = require("./screenshot-renderer/PuppeteerScreenshotRenderer");
const WebdriverScreenshotRenderer_1 = require("./screenshot-renderer/WebdriverScreenshotRenderer");
const config_1 = require("./screenshot-server/config");
const DockerizedScreenshotServer_1 = require("./screenshot-server/DockerizedScreenshotServer");
const LocalScreenshotServer_1 = require("./screenshot-server/LocalScreenshotServer");
const logger_1 = require("./logger");
const logDebug = logger_1.debugLogger("global-setup");
let screenshotServer = null;
function getScreenshotServer() {
    return screenshotServer;
}
exports.getScreenshotServer = getScreenshotServer;
async function setUpScreenshotServer() {
    logDebug(`Screenshot server setup initiated.`);
    if (screenshotServer) {
        throw new Error("Please only call setUpScreenshotServer() once.");
    }
    logDebug(`Creating screenshot server.`);
    screenshotServer = createScreenshotServer();
    logDebug(`Screenshot server instance created.`);
    try {
        logDebug(`Starting screenshot server.`);
        await screenshotServer.start();
        logDebug(`Screenshot server started.`);
    }
    catch (e) {
        if (e.message.indexOf("connect ECONNREFUSED /var/run/docker.sock") !== -1) {
            throw chalk_1.default.red(`

By default, ${constants_1.PACKAGE_NAME} requires Docker to produce consistent screenshots across platforms.

Please ensure Docker is running, or force local rendering with:
$ export SCREENSHOT_MODE=local

Alternatively if you'd like to use Percy (https://percy.io), set it up with:
$ export SCREENSHOT_MODE=percy
$ export PERCY_TOKEN=...
`);
        }
        throw e;
    }
}
exports.setUpScreenshotServer = setUpScreenshotServer;
function createScreenshotServer() {
    switch (config_1.SCREENSHOT_MODE) {
        case "puppeteer":
            return new LocalScreenshotServer_1.LocalScreenshotServer(new PuppeteerScreenshotRenderer_1.PuppeteerScreenshotRenderer(), config_1.SCREENSHOT_SERVER_PORT);
        case "docker":
            return new DockerizedScreenshotServer_1.DockerizedScreenshotServer(config_1.SCREENSHOT_SERVER_PORT);
        case "percy":
            return new LocalScreenshotServer_1.LocalScreenshotServer(new PercyScreenshotRenderer_1.PercyScreenshotRenderer(), config_1.SCREENSHOT_SERVER_PORT);
        case "selenium":
            return new LocalScreenshotServer_1.LocalScreenshotServer(new WebdriverScreenshotRenderer_1.SeleniumScreenshotRenderer({
                browserName: config_1.getSeleniumBrowser(),
            }), config_1.SCREENSHOT_SERVER_PORT);
        default:
            throw assert_never_1.default(config_1.SCREENSHOT_MODE);
    }
}
exports.default = setUpScreenshotServer;
