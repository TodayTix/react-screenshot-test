"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PuppeteerScreenshotRenderer_1 = require("./screenshot-renderer/PuppeteerScreenshotRenderer");
const LocalScreenshotServer_1 = require("./screenshot-server/LocalScreenshotServer");
const screenshotServer = new LocalScreenshotServer_1.LocalScreenshotServer(new PuppeteerScreenshotRenderer_1.PuppeteerScreenshotRenderer(), 3000);
screenshotServer
    .start()
    // eslint-disable-next-line no-console
    .then(() => console.log("Ready."))
    // eslint-disable-next-line no-console
    .catch(console.error);
