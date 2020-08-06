import { ScreenshotServer } from "./api";
/**
 * A screenshot server running inside a Docker container (which runs Chrome) to
 * ensure that screenshots are consistent across platforms.
 */
export declare class DockerizedScreenshotServer implements ScreenshotServer {
    private readonly port;
    private readonly docker;
    private container;
    constructor(port: number);
    start(): Promise<void>;
    stop(): Promise<void>;
}
