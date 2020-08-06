"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerizedScreenshotServer = void 0;
const chalk_1 = __importDefault(require("chalk"));
const dockerode_1 = __importDefault(require("dockerode"));
const logger_1 = require("../logger");
const config_1 = require("./config");
const DOCKER_IMAGE_TAG_NAME = "fwouts/chrome-screenshot";
const DOCKER_IMAGE_VERSION = "1.0.1";
const DOCKER_IMAGE_TAG = `${DOCKER_IMAGE_TAG_NAME}:${DOCKER_IMAGE_VERSION}`;
const logDebug = logger_1.debugLogger("DockerizedScreenshotServer");
/**
 * A screenshot server running inside a Docker container (which runs Chrome) to
 * ensure that screenshots are consistent across platforms.
 */
class DockerizedScreenshotServer {
    constructor(port) {
        this.port = port;
        this.container = null;
        this.docker = new dockerode_1.default({
            socketPath: process.platform === "win32"
                ? "//./pipe/docker_engine"
                : "/var/run/docker.sock",
        });
    }
    async start() {
        logDebug(`DockerizedScreenshotServer.start() initiated.`);
        if (this.container) {
            throw new Error("Container is already started! Please only call start() once.");
        }
        logDebug(`Ensuring that Docker image is present.`);
        await ensureDockerImagePresent(this.docker);
        logDebug(`Removing any old Docker containers.`);
        await removeLeftoverContainers(this.docker);
        logDebug(`Starting Docker container.`);
        this.container = await startContainer(this.docker, this.port);
        logDebug(`Docker container started.`);
    }
    async stop() {
        logDebug(`DockerizedScreenshotServer.stop() initiated.`);
        if (!this.container) {
            throw new Error("Container is not started! Please make sure that start() was called.");
        }
        logDebug(`Killing Docker container.`);
        await this.container.kill();
        logDebug(`Docker container killed.`);
        logDebug(`Removing Docker container.`);
        await this.container.remove();
        logDebug(`Docker container removed.`);
    }
}
exports.DockerizedScreenshotServer = DockerizedScreenshotServer;
async function ensureDockerImagePresent(docker) {
    const images = await docker.listImages({
        filters: {
            reference: {
                [DOCKER_IMAGE_TAG]: true,
            },
        },
    });
    if (images.length === 0) {
        throw new Error(`It looks like you're missing the Docker image required to render screenshots.\n\nPlease run the following command:\n\n$ docker pull ${DOCKER_IMAGE_TAG}\n\n`);
    }
}
async function removeLeftoverContainers(docker) {
    const existingContainers = await docker.listContainers();
    for (const existingContainerInfo of existingContainers) {
        const [name] = existingContainerInfo.Image.split(":");
        if (name === DOCKER_IMAGE_TAG_NAME) {
            // eslint-disable-next-line no-await-in-loop
            const existingContainer = await docker.getContainer(existingContainerInfo.Id);
            if (existingContainerInfo.State === "running") {
                // eslint-disable-next-line no-await-in-loop
                await existingContainer.stop();
            }
            // eslint-disable-next-line no-await-in-loop
            await existingContainer.remove();
        }
    }
}
async function startContainer(docker, port) {
    const container = await docker.createContainer({
        Image: DOCKER_IMAGE_TAG,
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        OpenStdin: false,
        StdinOnce: false,
        ExposedPorts: {
            "3000/tcp": {},
        },
        Env: [`SCREENSHOT_LOGGING_LEVEL=${config_1.getLoggingLevel()}`],
        HostConfig: {
            PortBindings: {
                "3000/tcp": [{ HostPort: `${port}` }],
            },
        },
    });
    await container.start();
    const stream = await container.logs({
        stdout: true,
        stderr: true,
        follow: true,
    });
    await new Promise((resolve) => {
        stream.on("data", (message) => {
            if (config_1.getLoggingLevel() === "DEBUG") {
                console.log(chalk_1.default.yellow(`Docker container output:\n${message}`));
            }
            if (message.toString().indexOf("Ready.") > -1) {
                resolve();
            }
        });
    });
    return container;
}
