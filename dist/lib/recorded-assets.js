"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetFilename = exports.recordAsset = exports.ASSET_SERVING_PREFIX = void 0;
const uuid = __importStar(require("uuid"));
exports.ASSET_SERVING_PREFIX = "/assets/";
/**
 * A map of generated asset path to actual filename.
 *
 * @example
 * {
 *   "abc-123": "/home/example/project/original.jpg"
 * }
 */
const recordedAssets = {};
/**
 * Record an imported asset.
 *
 * @returns its future URL on the component server.
 */
function recordAsset(filePath) {
    const extensionIndex = filePath.lastIndexOf(".");
    if (extensionIndex === -1) {
        throw new Error(`Unsupported asset with no extension: ${filePath}`);
    }
    const extension = filePath.substr(extensionIndex + 1);
    const generatedName = `${uuid.v4()}.${extension}`;
    recordedAssets[generatedName] = filePath;
    return `${exports.ASSET_SERVING_PREFIX}${generatedName}`;
}
exports.recordAsset = recordAsset;
/**
 * Returns the original asset file path from a served path.
 *
 * @param servedPath the component server path (e.g. `/assets/abc-123.jpg`)
 * @returns the original filename (e.g. `/home/example/project/original.jpg`)
 */
function getAssetFilename(servedPath) {
    if (!servedPath.startsWith(exports.ASSET_SERVING_PREFIX)) {
        throw new Error(`Invalid asset path: ${servedPath} (wrong prefix)`);
    }
    const generatedName = servedPath.substr(exports.ASSET_SERVING_PREFIX.length);
    const filePath = recordedAssets[generatedName];
    if (!filePath) {
        throw new Error(`Invalid asset path: ${servedPath} (never recorded)`);
    }
    return filePath;
}
exports.getAssetFilename = getAssetFilename;
