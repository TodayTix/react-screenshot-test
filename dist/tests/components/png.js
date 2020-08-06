"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PngComponent = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const social_png_1 = __importDefault(require("../../../brand/social.png"));
const Image = styled_components_1.default.img `
  width: 100%;
`;
exports.PngComponent = () => react_1.default.createElement(Image, { src: social_png_1.default });
