"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const lib_1 = require("../lib");
const css_modules_green_1 = require("./components/css-modules-green");
const css_modules_red_1 = require("./components/css-modules-red");
const emotion_1 = require("./components/emotion");
const global_css_blue_1 = require("./components/global-css-blue");
const global_css_orange_1 = require("./components/global-css-orange");
const inline_style_1 = require("./components/inline-style");
const sass_green_1 = require("./components/sass-green");
const styled_components_1 = require("./components/styled-components");
require("normalize.css");
require("./global-style.css");
const viewports_1 = require("./viewports");
lib_1.ReactScreenshotTest.create("Styled components")
    .viewports(viewports_1.VIEWPORTS)
    .shoot("inline style CSS", react_1.default.createElement(inline_style_1.InlineStyleComponent, null))
    .shoot("emotion CSS", react_1.default.createElement(emotion_1.EmotionComponent, null))
    .shoot("styled-components CSS", react_1.default.createElement(styled_components_1.StyledComponentsComponent, null))
    // Note: we intentionally use components that use the same class name. This is
    // used to highlight conflicts, which are expected to occur when two
    // components that use global CSS imports have conflicting class names.
    .shoot("global CSS orange", react_1.default.createElement(global_css_orange_1.GlobalCssOrangeComponent, null))
    // This will end up orange instead of blue!
    .shoot("global CSS blue", react_1.default.createElement(global_css_blue_1.GlobalCssBlueComponent, null))
    // CSS modules components should not conflict, because a new classname is
    // generated for each.
    .shoot("CSS modules red", react_1.default.createElement(css_modules_red_1.CssModulesRedComponent, null))
    .shoot("CSS modules green", react_1.default.createElement(css_modules_green_1.CssModulesGreenComponent, null))
    .shoot("SASS green", react_1.default.createElement(sass_green_1.SassGreenComponent, null))
    .run();
