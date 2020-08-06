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
exports.launchChrome = void 0;
async function launchChrome() {
    // Puppeteer is not a dependency, because most users would likely use Docker
    // which is the default behaviour.
    let puppeteer;
    try {
        puppeteer = await Promise.resolve().then(() => __importStar(require("puppeteer")));
    }
    catch (e) {
        throw new Error(`Please install the 'puppeteer' package:

Using NPM:
$ npm install -D puppeteer

Using Yarn:
$ yarn add -D puppeteer`);
    }
    return puppeteer.default.launch({
        args: ["--no-sandbox"],
    });
}
exports.launchChrome = launchChrome;
