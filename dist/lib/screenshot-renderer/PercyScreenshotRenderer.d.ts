import { Viewport } from "puppeteer";
import { ScreenshotRenderer } from "./api";
/**
 * A screenshot renderer that uses Percy to take and compare screenshots.
 */
export declare class PercyScreenshotRenderer implements ScreenshotRenderer {
    private browser;
    constructor();
    start(): Promise<void>;
    stop(): Promise<void>;
    render(name: string, url: string, viewport?: Viewport): Promise<null>;
}
