"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmotionComponent = void 0;
const styled_1 = __importDefault(require("@emotion/styled"));
const react_1 = __importDefault(require("react"));
const Container = styled_1.default.div `
  padding: 16px;
`;
const Button = styled_1.default.button `
  background: #00f;
  color: #fff;
  padding: 8px;
  border-radius: 4px;
  font-size: 2em;
`;
exports.EmotionComponent = () => (react_1.default.createElement(Container, null,
    react_1.default.createElement(Button, null, "This component was styled with Emotion")));
