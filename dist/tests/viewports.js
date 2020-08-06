"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VIEWPORTS = void 0;
const puppeteer_1 = require("puppeteer");
exports.VIEWPORTS = {
    Desktop: {
        width: 1024,
        height: 768,
    },
    "iPhone X": puppeteer_1.devices["iPhone X"].viewport,
};
