"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllUsers = exports.getAllUsers = exports.userLogin = exports.userSignup = void 0;
const authModel_1 = __importDefault(require("../models/authModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseHandler_1 = require("../utils/responseHandler");
/**siguser-
 * @route
 * @desc
 */
const userSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phone } = req.body;
        const existingUser = yield authModel_1.default.findOne({ email });
        if (existingUser)
            return (0, responseHandler_1.sendError)(res, 400, "Email already registered");
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield authModel_1.default.create({
            name,
            email,
            password: hashedPassword,
            phone,
        });
        const token = jsonwebtoken_1.default.sign({ id: newUser._id, role: "customer" }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        return (0, responseHandler_1.sendResponse)(res, 201, "User registered successfully", {
            user: newUser,
            token,
        });
    }
    catch (error) {
        return (0, responseHandler_1.sendError)(res, 500, error.message);
    }
});
exports.userSignup = userSignup;
/**
 * @route
 * @desc
 */
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phone, password } = req.body;
        let user;
        if (email) {
            user = yield authModel_1.default.findOne({ email });
        }
        else if (phone) {
            user = yield authModel_1.default.findOne({ phone });
        }
        if (!user) {
            return (0, responseHandler_1.sendError)(res, 400, "Invalid credentials");
        }
        // Compare password
        if (!(yield bcryptjs_1.default.compare(password, user.password))) {
            return (0, responseHandler_1.sendError)(res, 400, "Invalid credentials");
        }
        // Generate JWT token for regular user
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: "customer" }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        return (0, responseHandler_1.sendResponse)(res, 200, "Login successful", {
            token,
            role: "customer",
        });
    }
    catch (error) {
        return (0, responseHandler_1.sendError)(res, 500, error.message);
    }
});
exports.userLogin = userLogin;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield authModel_1.default.find({}, "-password");
        return (0, responseHandler_1.sendResponse)(res, 200, "All user fetched successfully", users);
    }
    catch (error) {
        return (0, responseHandler_1.sendError)(res, 500, error.message);
    }
});
exports.getAllUsers = getAllUsers;
const deleteAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield authModel_1.default.deleteMany({});
        return (0, responseHandler_1.sendResponse)(res, 200, `${result.deletedCount} users deleted successfully`);
    }
    catch (error) {
        return (0, responseHandler_1.sendError)(res, 500, error.message);
    }
});
exports.deleteAllUsers = deleteAllUsers;
