"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendResponse = exports.HttpStatus = void 0;
exports.HttpStatus = {
    OK: { code: 200, message: "OK" },
    CREATED: { code: 201, message: "Created" },
    BAD_REQUEST: { code: 400, message: "Bad Request" },
    INTERNAL_SERVER_ERROR: { code: 500, message: "Internal Server Error" },
};
const sendResponse = (res, statusCode, message, data) => {
    return res.status(statusCode).json({ success: true, message, data });
};
exports.sendResponse = sendResponse;
const sendError = (res, statusCode, message, error) => {
    return res.status(statusCode).json({ success: false, message, error });
};
exports.sendError = sendError;
