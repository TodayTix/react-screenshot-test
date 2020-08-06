"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const dummy_1 = require("../../testing/dummy");
const mock_1 = require("../../testing/mock");
const partial_mock_1 = require("../../testing/partial-mock");
const PuppeteerScreenshotRenderer_1 = require("./PuppeteerScreenshotRenderer");
jest.mock("puppeteer");
describe("PuppeteerScreenshotRenderer", () => {
    let mockBrowser;
    let mockPage;
    beforeEach(() => {
        jest.resetAllMocks();
        mockPage = partial_mock_1.partialMock({
            goto: jest.fn(),
            screenshot: jest.fn(),
            setViewport: jest.fn(),
            close: jest.fn(),
        });
        mockBrowser = partial_mock_1.partialMock({
            newPage: jest.fn().mockReturnValue(mockPage),
            close: jest.fn(),
        });
        mock_1.mocked(puppeteer_1.default.launch).mockResolvedValue(mockBrowser);
    });
    describe("start", () => {
        it("does not launch the browser if start() isn't called", async () => {
            // eslint-disable-next-line no-new
            new PuppeteerScreenshotRenderer_1.PuppeteerScreenshotRenderer();
            expect(puppeteer_1.default.launch).not.toHaveBeenCalled();
        });
        it("launches the browser when start() is called", async () => {
            const renderer = new PuppeteerScreenshotRenderer_1.PuppeteerScreenshotRenderer();
            await renderer.start();
            expect(puppeteer_1.default.launch).toHaveBeenCalled();
        });
        it("fails to start if browser could not be launched", async () => {
            mock_1.mocked(puppeteer_1.default.launch).mockRejectedValue(new Error("Could not start!"));
            const renderer = new PuppeteerScreenshotRenderer_1.PuppeteerScreenshotRenderer();
            await expect(renderer.start()).rejects.toEqual(new Error("Could not start!"));
        });
    });
    describe("stop", () => {
        it("cannot close the browser without first starting it", async () => {
            const renderer = new PuppeteerScreenshotRenderer_1.PuppeteerScreenshotRenderer();
            await expect(renderer.stop()).rejects.toEqual(new Error("Browser is not open! Please make sure that start() was called."));
        });
        it("closes the browser when stop() is called", async () => {
            const renderer = new PuppeteerScreenshotRenderer_1.PuppeteerScreenshotRenderer();
            await renderer.start();
            await renderer.stop();
            expect(mockBrowser.close).toHaveBeenCalled();
        });
        it("fails to stop if browser could not be closed", async () => {
            mockBrowser.close.mockRejectedValue(new Error("Could not stop!"));
            const renderer = new PuppeteerScreenshotRenderer_1.PuppeteerScreenshotRenderer();
            await renderer.start();
            await expect(renderer.stop()).rejects.toEqual(new Error("Could not stop!"));
        });
    });
    describe("render", () => {
        it("cannot render without first starting it", async () => {
            const renderer = new PuppeteerScreenshotRenderer_1.PuppeteerScreenshotRenderer();
            await expect(renderer.render("test", "http://example.com")).rejects.toEqual(new Error("Please call start() once before render()."));
        });
        it("takes a screenshot", async () => {
            const dummyBinaryScreenshot = dummy_1.dummy();
            mockPage.screenshot.mockResolvedValue(dummyBinaryScreenshot);
            const renderer = new PuppeteerScreenshotRenderer_1.PuppeteerScreenshotRenderer();
            await renderer.start();
            const screenshot = await renderer.render("test", "http://example.com");
            expect(screenshot).toBe(dummyBinaryScreenshot);
            expect(mockPage.goto).toHaveBeenCalledWith("http://example.com");
            expect(mockPage.screenshot).toHaveBeenCalledWith({
                encoding: "binary",
            });
            expect(mockPage.close).toHaveBeenCalled();
        });
        it("sets the viewport if provided", async () => {
            const renderer = new PuppeteerScreenshotRenderer_1.PuppeteerScreenshotRenderer();
            await renderer.start();
            await renderer.render("test", "http://example.com", {
                width: 1024,
                height: 768,
            });
            expect(mockPage.setViewport).toHaveBeenCalledWith({
                width: 1024,
                height: 768,
            });
        });
        it("does not set the viewport if not provided", async () => {
            const renderer = new PuppeteerScreenshotRenderer_1.PuppeteerScreenshotRenderer();
            await renderer.start();
            await renderer.render("test", "http://example.com");
            expect(mockPage.setViewport).not.toHaveBeenCalled();
        });
    });
});
