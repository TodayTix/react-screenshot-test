"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const fetch_1 = require("../network/fetch");
const ReactComponentServer_1 = require("./ReactComponentServer");
describe("ReactComponentServer", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it("renders the requested node", async () => {
        const server = new ReactComponentServer_1.ReactComponentServer({});
        await server.start();
        let rendered = false;
        await server.serve({
            name: "test",
            reactNode: react_1.default.createElement("div", null, "Hello, World!"),
            remoteStylesheetUrls: [
                "https://fonts.googleapis.com/css?family=Roboto",
            ],
            remoteJavascriptUrls: [],
        }, async (port, path) => {
            const { body } = await fetch_1.fetch(`http://localhost:${port}${path}`);
            const data = body.toString("utf8");
            // Fuzzy match.
            expect(data).toContain("<div>Hello, World!</div>");
            // Exact match.
            expect(data).toMatchInlineSnapshot(`
          "<html data-reactroot=\\"\\"><head><meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\"/><link rel=\\"stylesheet\\" href=\\"https://fonts.googleapis.com/css?family=Roboto\\"/><style>
          * {
            transition: none !important;
            animation: none !important;
          }
          </style><style data-styled=\\"\\" data-styled-version=\\"5.0.1\\"></style></head><body><div>Hello, World!</div></body></html>"
        `);
            rendered = true;
        });
        expect(rendered).toBe(true);
        await server.stop();
    });
});
