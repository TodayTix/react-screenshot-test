"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineStyleComponent = void 0;
const react_1 = __importDefault(require("react"));
exports.InlineStyleComponent = () => (react_1.default.createElement("div", { style: {
        padding: 16,
    } },
    react_1.default.createElement("button", { style: {
            background: "#00f",
            color: "#fff",
            padding: 8,
            borderRadius: 4,
            fontSize: "2em",
        } }, "This component was styled with inline styles")));
