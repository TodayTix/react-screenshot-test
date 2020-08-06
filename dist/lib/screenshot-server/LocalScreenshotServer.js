"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalScreenshotServer = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const logger_1 = require("../logger");
const logDebug = logger_1.debugLogger("LocalScreenshotServer");
/**
 * A local server with a /render POST endpoint, which takes a payload such as
 *
 * ```json
 * {
 *   "url": "https://www.google.com"
 * }
 * ```
 *
 * and returns a PNG screenshot of the URL.
 */
class LocalScreenshotServer {
    constructor(renderer, port) {
        this.renderer = renderer;
        this.port = port;
        this.server = null;
        this.app = express_1.default();
        this.app.use(body_parser_1.default.json());
        this.app.post("/render", async (req, res) => {
            const { name, url, viewport, onPageLoaded } = req.body;
            const screenshot = await (viewport
                ? this.renderer.render(name, url, viewport, onPageLoaded)
                : this.renderer.render(name, url));
            if (screenshot) {
                res.contentType("image/png");
                res.end(screenshot);
            }
            else {
                res.status(204);
                res.end();
            }
        });
    }
    async start() {
        logDebug(`start() initiated.`);
        logDebug(`Starting renderer.`);
        await this.renderer.start();
        logDebug(`Renderer started.`);
        logDebug(`Attempting to listen on port ${this.port}.`);
        await new Promise((resolve) => {
            this.server = this.app.listen(this.port, resolve);
        });
        logDebug(`Successfully listening on port ${this.port}.`);
    }
    async stop() {
        logDebug(`stop() initiated.`);
        const { server } = this;
        if (!server) {
            throw new Error("Server is not running! Please make sure that start() was called.");
        }
        logDebug(`Attempting to shutdown server.`);
        await new Promise((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
        logDebug(`Successfully shutdown server.`);
        logDebug(`Stopping renderer.`);
        await this.renderer.stop();
        logDebug(`Renderer stopped.`);
    }
}
exports.LocalScreenshotServer = LocalScreenshotServer;
