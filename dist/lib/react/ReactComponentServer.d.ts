import React from "react";
/**
 * ReactComponentServer renders React nodes in a plain HTML page.
 */
export declare class ReactComponentServer {
    private readonly app;
    private server;
    private port;
    private readonly nodes;
    constructor(staticPaths: Record<string, string>);
    private renderWithStyledComponents;
    private renderWithoutStyledComponents;
    start(): Promise<void>;
    stop(): Promise<void>;
    serve<T>(node: NodeDescription, ready: (port: number, path: string) => Promise<T>, id?: string): Promise<T>;
}
export interface NodeDescription {
    name: string;
    reactNode: React.ReactNode;
    remoteStylesheetUrls: string[];
    remoteJavascriptUrls: string[];
}
