"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = void 0;
const http_1 = __importDefault(require("http"));
/**
 * A minimal implementation of fetch().
 *
 * We don't use Axios or any other library to reduce the chance of conflict with
 * mocks that a library user may have set up in their own project. See
 * https://github.com/fwouts/react-screenshot-test/issues/178#issuecomment-621194050
 * for a concrete example of this happening.
 */
function fetch(url, method = "GET", body) {
    const requestData = body ? JSON.stringify(body) : "";
    return new Promise((resolve, reject) => {
        const request = http_1.default.request(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Content-Length": requestData.length,
            },
        }, (response) => {
            const responseData = [];
            response.on("error", (error) => {
                reject(error);
            });
            response.on("data", (data) => {
                responseData.push(data);
            });
            response.on("end", () => {
                resolve({
                    status: response.statusCode || 200,
                    body: Buffer.concat(responseData),
                });
            });
        });
        request.write(requestData);
        request.end();
    });
}
exports.fetch = fetch;
