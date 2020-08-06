/// <reference types="node" />
import { ScreenshotRenderer, Viewport } from "./api";
/**
 * A screenshot renderer that uses Chrome (via Puppeteer) to take screenshots on
 * the current platform.
 */
export declare class PuppeteerScreenshotRenderer implements ScreenshotRenderer {
    private browser;
    start(): Promise<void>;
    stop(): Promise<void>;
    render(name: string, url: string, viewport?: Viewport, cb?: string): Promise<Buffer>;
}
