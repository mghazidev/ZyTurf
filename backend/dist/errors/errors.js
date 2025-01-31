"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomAPIError = void 0;
class CustomAPIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
    static response(message, statusCode) {
        return new CustomAPIError(message, statusCode);
    }
}
exports.CustomAPIError = CustomAPIError;
