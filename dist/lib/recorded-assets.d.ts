export declare const ASSET_SERVING_PREFIX = "/assets/";
/**
 * Record an imported asset.
 *
 * @returns its future URL on the component server.
 */
export declare function recordAsset(filePath: string): string;
/**
 * Returns the original asset file path from a served path.
 *
 * @param servedPath the component server path (e.g. `/assets/abc-123.jpg`)
 * @returns the original filename (e.g. `/home/example/project/original.jpg`)
 */
export declare function getAssetFilename(servedPath: string): string;
