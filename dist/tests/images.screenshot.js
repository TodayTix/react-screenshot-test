"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const lib_1 = require("../lib");
const png_1 = require("./components/png");
const static_image_1 = require("./components/static-image");
const svg_1 = require("./components/svg");
const viewports_1 = require("./viewports");
lib_1.ReactScreenshotTest.create("Images")
    .viewports(viewports_1.VIEWPORTS)
    .static("/public", "src/tests/public")
    .shoot("PNG", react_1.default.createElement(png_1.PngComponent, null))
    .shoot("SVG", react_1.default.createElement(svg_1.SvgComponent, null))
    .shoot("Static image", react_1.default.createElement(static_image_1.StaticImageComponent, null))
    .run();
