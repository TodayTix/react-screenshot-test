"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mocked = void 0;
function mocked(f) {
    if (!jest.isMockFunction(f)) {
        throw new Error("Expected a mock, but found a real function.");
    }
    return f;
}
exports.mocked = mocked;
