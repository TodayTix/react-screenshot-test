import { ScreenshotRenderer } from "../screenshot-renderer/api";
import { ScreenshotServer } from "./api";
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
export declare class LocalScreenshotServer implements ScreenshotServer {
    private readonly renderer;
    private readonly port;
    private readonly app;
    private server;
    constructor(renderer: ScreenshotRenderer, port: number);
    start(): Promise<void>;
    stop(): Promise<void>;
}
