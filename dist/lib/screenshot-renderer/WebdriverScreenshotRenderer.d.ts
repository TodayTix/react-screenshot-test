/// <reference types="webdriver" />
/// <reference types="node" />
import { ScreenshotRenderer, Viewport } from "./api";
/**
 * A screenshot renderer that uses a browser controlled by Selenium to take
 * screenshots on the current platform.
 */
export declare class SeleniumScreenshotRenderer implements ScreenshotRenderer {
    private readonly capabilities;
    private seleniumProcess;
    private browser;
    constructor(capabilities: WebDriver.DesiredCapabilities);
    start(): Promise<void>;
    stop(): Promise<void>;
    render(name: string, url: string, viewport?: Viewport): Promise<Buffer>;
}
