"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_port_1 = __importDefault(require("get-port"));
const partial_mock_1 = require("../../testing/partial-mock");
const LocalScreenshotServer_1 = require("./LocalScreenshotServer");
const fetch_1 = require("../network/fetch");
describe("LocalScreenshotServer", () => {
    let mockRenderer;
    beforeEach(() => {
        jest.resetAllMocks();
        mockRenderer = partial_mock_1.partialMock({
            start: jest.fn(),
            stop: jest.fn(),
            render: jest.fn(),
        });
    });
    it("renders with viewport", async () => {
        const port = await get_port_1.default();
        const server = new LocalScreenshotServer_1.LocalScreenshotServer(mockRenderer, port);
        await server.start();
        expect(mockRenderer.start).toHaveBeenCalled();
        await fetch_1.fetch(`http://localhost:${port}/render`, "POST", {
            name: "screenshot",
            url: "http://example.com",
            viewport: {
                with: 1024,
                height: 768,
            },
        });
        expect(mockRenderer.render).toHaveBeenCalledWith("screenshot", "http://example.com", {
            with: 1024,
            height: 768,
        });
        await server.stop();
        expect(mockRenderer.stop).toHaveBeenCalled();
    });
    it("renders without viewport", async () => {
        const port = await get_port_1.default();
        const server = new LocalScreenshotServer_1.LocalScreenshotServer(mockRenderer, port);
        await server.start();
        expect(mockRenderer.start).toHaveBeenCalled();
        await fetch_1.fetch(`http://localhost:${port}/render`, "POST", {
            name: "screenshot",
            url: "http://example.com",
        });
        expect(mockRenderer.render).toHaveBeenCalledWith("screenshot", "http://example.com");
        await server.stop();
        expect(mockRenderer.stop).toHaveBeenCalled();
    });
});
