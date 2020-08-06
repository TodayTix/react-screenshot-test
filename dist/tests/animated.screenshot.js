"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const lib_1 = require("../lib");
const animated_1 = require("./components/animated");
const viewports_1 = require("./viewports");
lib_1.ReactScreenshotTest.create("Animated components")
    .viewports(viewports_1.VIEWPORTS)
    .shoot("animated", react_1.default.createElement(animated_1.AnimatedComponent, null))
    .run();
