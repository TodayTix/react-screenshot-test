"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CssModulesRedComponent = void 0;
const react_1 = __importDefault(require("react"));
const css_modules_red_module_css_1 = __importDefault(require("./css-modules-red.module.css"));
exports.CssModulesRedComponent = () => (react_1.default.createElement("div", { className: css_modules_red_module_css_1.default.container },
    react_1.default.createElement("button", { className: css_modules_red_module_css_1.default.styledButton }, "This component was styled with CSS modules")));
