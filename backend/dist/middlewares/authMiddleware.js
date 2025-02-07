"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const responseHandler_1 = require("../utils/responseHandler");
const utils_1 = require("../utils/utils");
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.BAD_REQUEST.code, "Access Denied");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        req.user = { userId: decoded.userId }; // Now TypeScript recognizes `req.user`
        next();
    }
    catch (error) {
        return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.BAD_REQUEST.code, "Invalid Token");
    }
};
exports.authMiddleware = authMiddleware;
