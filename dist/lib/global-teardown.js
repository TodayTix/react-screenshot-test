"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tearDownScreenshotServer = void 0;
const global_setup_1 = require("./global-setup");
const logger_1 = require("./logger");
const logDebug = logger_1.debugLogger("global-teardown");
async function tearDownScreenshotServer() {
    logDebug(`Screenshot server teardown initiated.`);
    const screenshotServer = global_setup_1.getScreenshotServer();
    if (screenshotServer) {
        logDebug(`Stopping screenshot server.`);
        await screenshotServer.stop();
        logDebug(`Screenshot server stopped.`);
    }
    else {
        logDebug(`No screenshot server was found.`);
    }
}
exports.tearDownScreenshotServer = tearDownScreenshotServer;
exports.default = tearDownScreenshotServer;
