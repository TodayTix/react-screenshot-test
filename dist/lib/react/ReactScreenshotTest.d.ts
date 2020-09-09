/// <reference types="react" />
import { MatchImageSnapshotOptions } from "jest-image-snapshot";
import { Viewport } from "../screenshot-renderer/api";
import { Page } from "puppeteer";
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
export declare class ReactScreenshotTest {
    private readonly componentName;
    private readonly _viewports;
    private readonly _shots;
    private readonly _remoteStylesheetUrls;
    private readonly _remoteJavascriptUrls;
    private readonly _staticPaths;
    private readonly _onPageLoadedCallbacks;
    private ran;
    private customImageSnapshotOptions;
    /**
     * Creates a screenshot test.
     */
    static create(componentName: string): ReactScreenshotTest;
    private constructor();
    /**
     * Set custom options for image snapshot testing.
     */
    setCustomImageSnapshotOptions(options: MatchImageSnapshotOptions): this;
    /**
     * Adds a set of viewports to the screenshot test.
     */
    viewports(viewports: {
        [name: string]: Viewport;
    }): this;
    /**
     * Adds a single viewport to the screenshot test.
     */
    viewport(viewportName: string, viewport: Viewport): this;
    /**
     * Adds a specific shot of a component to the screenshot test.
     */
    shoot(shotName: string, component: React.ReactNode, callback?: (page: Page) => any): this;
    remoteStylesheet(stylesheetUrl: string): this;
    remoteJavascript(javascriptUrls: string): this;
    static(mappedPath: string, dirOrFilePath: string): this;
    /**
     * Runs the actual test (delegating to Jest).
     */
    run(): void;
    private render;
}
