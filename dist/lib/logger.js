"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugLogger = void 0;
const config_1 = require("./screenshot-server/config");
function logDebug(tag, message) {
    if (config_1.getLoggingLevel() !== "DEBUG") {
        return;
    }
    console.log(`[DEBUG:${tag}] ${message}`);
}
exports.debugLogger = (tag) => (message) => logDebug(tag, message);
