import { LoggingConfig } from "../logger";
export declare const SCREENSHOT_SERVER_PORT: number;
export declare const SCREENSHOT_SERVER_URL: string;
export declare const SCREENSHOT_MODE: "puppeteer" | "selenium" | "docker" | "percy";
export declare function getSeleniumBrowser(): string;
export declare function getScreenshotPrefix(): string;
export declare function getLoggingLevel(): LoggingConfig;
