"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimatedComponent = void 0;
const react_1 = __importDefault(require("react"));
const react_spinners_1 = require("react-spinners");
exports.AnimatedComponent = () => react_1.default.createElement(react_spinners_1.ClipLoader, null);
