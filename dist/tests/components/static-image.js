"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticImageComponent = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Image = styled_components_1.default.img `
  width: 100%;
`;
exports.StaticImageComponent = () => react_1.default.createElement(Image, { src: "/public/react.png" });
