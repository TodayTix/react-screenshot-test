"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalCssOrangeComponent = void 0;
const react_1 = __importDefault(require("react"));
require("./global-style-orange.css");
exports.GlobalCssOrangeComponent = () => (react_1.default.createElement("div", { className: "container" },
    react_1.default.createElement("button", { className: "styledButton" }, "This component was styled with global CSS")));
