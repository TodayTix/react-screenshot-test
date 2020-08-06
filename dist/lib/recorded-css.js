"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readRecordedCss = exports.recordCss = void 0;
/**
 * A concatenated string of all CSS stylesheets imported directly or indirectly from the test.
 *
 * Transitions and animations are always disabled.
 */
let recordedCss = `
* {
  transition: none !important;
  animation: none !important;
}
`;
/**
 * Record an imported CSS stylesheet.
 */
function recordCss(css) {
    recordedCss += css;
}
exports.recordCss = recordCss;
/**
 * Read all CSS stylesheets as a single CSS string.
 */
function readRecordedCss() {
    return recordedCss;
}
exports.readRecordedCss = readRecordedCss;
