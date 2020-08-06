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
exports.ReactComponentServer = void 0;
const express_1 = __importDefault(require("express"));
const get_port_1 = __importDefault(require("get-port"));
const react_1 = __importDefault(require("react"));
const server_1 = __importDefault(require("react-dom/server"));
const uuid = __importStar(require("uuid"));
const logger_1 = require("../logger");
const recorded_assets_1 = require("../recorded-assets");
const recorded_css_1 = require("../recorded-css");
const viewportMeta = react_1.default.createElement("meta", {
    name: "viewport",
    content: "width=device-width, initial-scale=1.0",
});
const logDebug = logger_1.debugLogger("ReactComponentServer");
/**
 * ReactComponentServer renders React nodes in a plain HTML page.
 */
class ReactComponentServer {
    constructor(staticPaths) {
        this.server = null;
        this.port = null;
        this.nodes = {};
        this.app = express_1.default();
        for (const [mappedPath, dirOrFilePath] of Object.entries(staticPaths)) {
            this.app.use(mappedPath, express_1.default.static(dirOrFilePath));
        }
        this.app.get("/render/:nodeId", (req, res) => {
            const { nodeId } = req.params;
            const node = this.nodes[nodeId];
            logDebug(`Received request to render node ${nodeId}.`);
            if (!node) {
                throw new Error(`No node to render for ID: ${nodeId}`);
            }
            // In order to render styled components, we need to collect the styles.
            // However, some projects don't use styled components, and it woudln't be
            // fair to ask them to install it. Therefore, we rely on a dynamic import
            // which we expect to fail if the package isn't installed. That's OK,
            // because that means we can render without it.
            Promise.resolve().then(() => __importStar(require("styled-components"))).then(({ ServerStyleSheet }) => this.renderWithStyledComponents(new ServerStyleSheet(), node))
                .catch(() => this.renderWithoutStyledComponents(node))
                .then((html) => res.send(html));
        });
        this.app.get(`${recorded_assets_1.ASSET_SERVING_PREFIX}:asset.:ext`, (req, res) => {
            const filePath = recorded_assets_1.getAssetFilename(req.path);
            logDebug(`Serving static asset ${req.path} from ${filePath}.`);
            res.sendFile(filePath);
        });
    }
    renderWithStyledComponents(sheet, node) {
        logDebug(`Initiating render with styled-components.`);
        // See https://www.styled-components.com/docs/advanced#server-side-rendering
        // for details.
        try {
            const rendered = server_1.default.renderToString(sheet.collectStyles(node.reactNode));
            const html = server_1.default.renderToString(react_1.default.createElement("html", null, react_1.default.createElement("head", null, viewportMeta, ...node.remoteStylesheetUrls.map((url) => react_1.default.createElement("link", {
                rel: "stylesheet",
                href: url,
            })), ...node.remoteJavascriptUrls.map((src) => react_1.default.createElement("script", {
                src,
                type: "application/javascript",
            })), react_1.default.createElement("style", {
                dangerouslySetInnerHTML: { __html: recorded_css_1.readRecordedCss() },
            }), sheet.getStyleElement()), react_1.default.createElement("body", {
                dangerouslySetInnerHTML: { __html: rendered },
            })));
            return html;
        }
        finally {
            sheet.seal();
        }
    }
    renderWithoutStyledComponents(node) {
        logDebug(`Initiating render without styled-components.`);
        // Simply render the node. This works with Emotion, too!
        return server_1.default.renderToString(react_1.default.createElement("html", null, react_1.default.createElement("head", null, viewportMeta, ...node.remoteStylesheetUrls.map((url) => react_1.default.createElement("link", {
            rel: "stylesheet",
            href: url,
        })), ...node.remoteJavascriptUrls.map((src) => react_1.default.createElement("script", {
            src,
            type: "application/javascript",
        })), react_1.default.createElement("style", {
            dangerouslySetInnerHTML: { __html: recorded_css_1.readRecordedCss() },
        })), react_1.default.createElement("body", null, node.reactNode)));
    }
    async start() {
        logDebug(`start() initiated.`);
        if (this.server) {
            throw new Error("Server is already running! Please only call start() once.");
        }
        this.port = await get_port_1.default();
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
    }
    async serve(node, ready, id = uuid.v4()) {
        logDebug(`serve() initiated with node ID: ${id}`);
        if (!this.server || !this.port) {
            throw new Error("Server is not running! Please make sure that start() was called.");
        }
        logDebug(`Storing node.`);
        this.nodes[id] = node;
        logDebug(`Rendering node.`);
        const result = await ready(this.port, `/render/${id}`);
        logDebug(`Node rendered.`);
        logDebug(`Deleting node.`);
        delete this.nodes[id];
        return result;
    }
}
exports.ReactComponentServer = ReactComponentServer;
