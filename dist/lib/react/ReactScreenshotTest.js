"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactScreenshotTest = void 0;
const callsites_1 = __importDefault(require("callsites"));
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = require("fs");
const jest_image_snapshot_1 = require("jest-image-snapshot");
const path_1 = require("path");
const logger_1 = require("../logger");
const fetch_1 = require("../network/fetch");
const config_1 = require("../screenshot-server/config");
const ReactComponentServer_1 = require("./ReactComponentServer");
const logDebug = logger_1.debugLogger("ReactScreenshotTest");
/**
 * ReactScreenshotTest is a builder for screenshot tests.
 *
 * Example usage:
 * ```
 * ReactScreenshotTest.create("Using runner")
 *     .viewports(VIEWPORTS)
 *     .shoot("with title", <MyComponent title="Hello, World!" />)
 *     .shoot("without title", <MyComponent title={null} />)
 *     .run();
 * ```
 */
class ReactScreenshotTest {
    constructor(componentName) {
        this.componentName = componentName;
        this._viewports = {};
        this._shots = {};
        this._remoteStylesheetUrls = [];
        this._remoteJavascriptUrls = [];
        this._staticPaths = {};
        this._onPageLoadedCallbacks = {};
        this.ran = false;
        this.customImageSnapshotOptions = {};
        setImmediate(() => {
            if (!this.ran) {
                throw new Error("Please call .run()");
            }
        });
    }
    /**
     * Creates a screenshot test.
     */
    static create(componentName) {
        return new this(componentName);
    }
    /**
     * Adds a set of viewports to the screenshot test.
     */
    setCustomImageSnapshotOptions(options) {
        this.customImageSnapshotOptions = { ...options };
        return this;
    }
    /**
     * Adds a set of viewports to the screenshot test.
     */
    viewports(viewports) {
        for (const [name, viewport] of Object.entries(viewports)) {
            this.viewport(name, viewport);
        }
        return this;
    }
    /**
     * Adds a single viewport to the screenshot test.
     */
    viewport(viewportName, viewport) {
        if (this.ran) {
            throw new Error("Cannot add a viewport after running.");
        }
        if (this._viewports[viewportName]) {
            throw new Error(`Viewport "${viewportName}" is declared more than once`);
        }
        this._viewports[viewportName] = viewport;
        return this;
    }
    /**
     * Adds a specific shot of a component to the screenshot test.
     */
    shoot(shotName, component, callback) {
        if (this.ran) {
            throw new Error("Cannot add a shot after running.");
        }
        if (this._shots[shotName]) {
            throw new Error(`Shot "${shotName}" is declared more than once`);
        }
        this._onPageLoadedCallbacks[shotName] = callback;
        this._shots[shotName] = component;
        return this;
    }
    remoteStylesheet(stylesheetUrl) {
        this._remoteStylesheetUrls.push(stylesheetUrl);
        return this;
    }
    remoteJavascript(javascriptUrls) {
        this._remoteJavascriptUrls.push(javascriptUrls);
        return this;
    }
    static(mappedPath, dirOrFilePath) {
        if (!mappedPath.startsWith("/")) {
            throw new Error("Directory mapping path must start with /");
        }
        if (!fs_1.existsSync(dirOrFilePath)) {
            throw new Error(`Could not find path "${dirOrFilePath}". Consider using path.resolve() to get an absolute path.`);
        }
        if (this._staticPaths[mappedPath]) {
            throw new Error("Cannot map multiple directories to the same path");
        }
        this._staticPaths[mappedPath] = dirOrFilePath;
        return this;
    }
    /**
     * Runs the actual test (delegating to Jest).
     */
    run() {
        if (this.ran) {
            throw new Error("Cannot run more than once.");
        }
        this.ran = true;
        if (Object.keys(this._viewports).length === 0) {
            throw new Error("Please define viewports with .viewport()");
        }
        if (Object.keys(this._shots).length === 0) {
            throw new Error("Please define shots with .shoot()");
        }
        const componentServer = new ReactComponentServer_1.ReactComponentServer(this._staticPaths);
        expect.extend({ toMatchImageSnapshot: jest_image_snapshot_1.toMatchImageSnapshot });
        beforeAll(async () => {
            await componentServer.start();
        });
        afterAll(async () => {
            await componentServer.stop();
        });
        const testFilename = callsites_1.default()[1].getFileName();
        const snapshotsDir = path_1.dirname(testFilename);
        const prefix = config_1.getScreenshotPrefix();
        // jest-image-snapshot doesn't support a snapshot identifier such as
        // "abc/def". Instead, we need some logic to look for a directory
        // separator (using `sep`) and set the subdirectory to "abc", only using
        // "def" as the identifier prefix.
        let subdirectory = "";
        let filenamePrefix = "";
        if (prefix.indexOf(path_1.sep) > -1) {
            [subdirectory, filenamePrefix] = prefix.split(path_1.sep, 2);
        }
        else {
            filenamePrefix = prefix;
        }
        describe(this.componentName, () => {
            for (const [viewportName, viewport] of Object.entries(this._viewports)) {
                describe(viewportName, () => {
                    for (const [shotName, shot] of Object.entries(this._shots)) {
                        it(shotName, async () => {
                            const name = `${this.componentName} - ${viewportName} - ${shotName}`;
                            logDebug(`Requesting component server to generate screenshot: ${name}`);
                            const screenshot = await componentServer.serve({
                                name,
                                reactNode: shot,
                                remoteStylesheetUrls: this._remoteStylesheetUrls,
                                remoteJavascriptUrls: this._remoteJavascriptUrls,
                            }, async (port, path) => {
                                const url = config_1.SCREENSHOT_MODE === "docker"
                                    ? `http://host.docker.internal:${port}${path}`
                                    : `http://localhost:${port}${path}`;
                                return this.render(name, url, viewport, this._onPageLoadedCallbacks[shotName]);
                            });
                            logDebug(`Screenshot generated.`);
                            if (screenshot) {
                                logDebug(`Comparing screenshot.`);
                                expect(screenshot).toMatchImageSnapshot({
                                    failureThreshold: 0.05,
                                    failureThresholdType: 'percent',
                                    customSnapshotsDir: path_1.join(snapshotsDir, "__screenshots__", this.componentName, subdirectory),
                                    customSnapshotIdentifier: `${filenamePrefix}${viewportName} - ${shotName}`,
                                    ...this.customImageSnapshotOptions,
                                });
                                logDebug(`Screenshot compared.`);
                            }
                            else {
                                logDebug(`Skipping screenshot matching.`);
                            }
                        });
                    }
                });
            }
        });
    }
    async render(name, url, viewport, cb) {
        try {
            logDebug(`Initiating request to screenshot server at ${config_1.SCREENSHOT_SERVER_URL}.`);
            const response = await fetch_1.fetch(`${config_1.SCREENSHOT_SERVER_URL}/render`, "POST", {
                name,
                url,
                viewport,
                onPageLoaded: cb ? cb.toString() : '',
            });
            logDebug(`Response received with status code ${response.status}.`);
            if (response.status === 204) {
                return null;
            }
            return response.body;
        }
        catch (e) {
            // eslint-disable-next-line no-console
            console.error(chalk_1.default.red(`Unable to reach screenshot server. Please make sure that your Jest configuration contains the following:

{
  "globalSetup": "react-screenshot-test/global-setup",
  "globalTeardown": "react-screenshot-test/global-teardown"
}
`));
            throw e;
        }
    }
}
exports.ReactScreenshotTest = ReactScreenshotTest;
