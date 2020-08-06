"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SassGreenComponent = void 0;
const react_1 = __importDefault(require("react"));
require("./sass-green.scss");
exports.SassGreenComponent = () => (react_1.default.createElement("div", { className: "sass-container" },
    react_1.default.createElement("button", { className: "styledButton" }, "This component was styled with SASS")));
