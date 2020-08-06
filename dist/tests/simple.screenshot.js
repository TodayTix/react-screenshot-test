"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const lib_1 = require("../lib");
const viewports_1 = require("./viewports");
lib_1.ReactScreenshotTest.create("Simple HTML")
    .viewports(viewports_1.VIEWPORTS)
    .shoot("basic div", react_1.default.createElement("div", null, "Simple element"))
    .run();
