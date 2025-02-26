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
exports.getGroundOwnerById = exports.deleteGroundOwnerById = exports.deleteAllGroundOwners = exports.getGroundOwnerList = exports.updateGroundOwner = exports.registerGroundOwner = exports.logoutGroundOwner = exports.loginGroundOwner = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const dao_1 = __importDefault(require("../services/dao"));
const joi_1 = __importDefault(require("joi"));
const utils_1 = require("../utils/utils");
const errors_1 = require("../errors/errors");
const config_1 = require("../config/config");
const Generic_1 = require("../utils/Generic");
const formidable_1 = __importDefault(require("formidable"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const groundOwnerModel_1 = __importDefault(require("../models/groundOwnerModel"));
const blacklistedTokens = new Set();
const loginGroundOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        let groundUser;
        if (email) {
            groundUser = yield groundOwnerModel_1.default.findOne({ email });
        }
        if (!groundUser) {
            return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.BAD_REQUEST.code, "Invalid User");
        }
        if (!(yield bcryptjs_1.default.compare(password, groundUser.password))) {
            return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.BAD_REQUEST.code, "Invalid password");
        }
        if (!groundUser || !groundUser._id) {
            return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.BAD_REQUEST.code, "No user find");
        }
        const token = (0, jwt_1.generateToken)(groundUser._id.toString());
        return (0, responseHandler_1.sendResponse)(res, utils_1.HttpStatus.OK.code, "Login successful", {
            groundUser,
            token,
        });
    }
    catch (error) {
        return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.INTERNAL_SERVER_ERROR.code, error.message);
    }
});
exports.loginGroundOwner = loginGroundOwner;
const logoutGroundOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Extract the token from the Authorization header
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            return (0, responseHandler_1.sendResponse)(res, utils_1.HttpStatus.BAD_REQUEST.code, "No token provided", {});
        }
        // Add the token to the blacklist
        blacklistedTokens.add(token);
        // Now that the token is blacklisted, it will be treated as invalid in the future
        return (0, responseHandler_1.sendResponse)(res, utils_1.HttpStatus.OK.code, "Logout successful", {});
    }
    catch (error) {
        return (0, responseHandler_1.sendResponse)(res, utils_1.HttpStatus.INTERNAL_SERVER_ERROR.code, error.message, {});
    }
});
exports.logoutGroundOwner = logoutGroundOwner;
const registerGroundOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const form = (0, formidable_1.default)();
        // Promise to parse the form and handle fields/files
        const [fields, files] = yield new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(errors_1.CustomAPIError.response(err.message, utils_1.HttpStatus.BAD_REQUEST.code));
                }
                else {
                    resolve([fields, files]);
                }
            });
        });
        Object.keys(fields).forEach((key) => {
            if (Array.isArray(fields[key])) {
                fields[key] = fields[key][0];
            }
        });
        const { error, value } = joi_1.default.object({
            fullname: joi_1.default.string().required().label("Full Name"),
            email: joi_1.default.string().email().required().label("Email"),
            contactNo: joi_1.default.string().required().label("Contact Number"),
            groundLocation: joi_1.default.string().required().label("Ground Location"),
            paymentMethod: joi_1.default.string().required().label("Payment Method"),
            password: joi_1.default.string().min(6).required().label("Password"),
        }).validate(fields);
        if (error) {
            return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.BAD_REQUEST.code, error.details[0].message);
        }
        const { fullname, contactNo, email, groundLocation, paymentMethod, password, } = value;
        const existingGroundOwner = yield dao_1.default.groundOwnerDAOService.findByAny({
            $or: [{ email }, { contactNo }],
        });
        if (existingGroundOwner) {
            return (0, responseHandler_1.sendResponse)(res, utils_1.HttpStatus.OK.code, "Ground owner already registered", existingGroundOwner);
        }
        const basePath = `${config_1.UPLOAD_BASE_PATH}/groundOwner`;
        let cnicFrontUrl = "";
        let cnicBackUrl = "";
        const cnicFront = (_a = files.cnicFrontUrl) === null || _a === void 0 ? void 0 : _a[0];
        const cnicBack = (_b = files.cnicBackUrl) === null || _b === void 0 ? void 0 : _b[0];
        if (cnicFront) {
            if (!config_1.ALLOWED_FILE_TYPES.includes(cnicFront.mimetype || "")) {
                return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.BAD_REQUEST.code, "Invalid file type for CNIC front");
            }
            const outputPath = yield Generic_1.Generic.compressImage(cnicFront.filepath);
            cnicFrontUrl = yield Generic_1.Generic.getImagePath({
                tempPath: outputPath,
                filename: cnicFront.originalFilename || "cnicFront",
                basePath,
            });
        }
        if (cnicBack) {
            if (!config_1.ALLOWED_FILE_TYPES.includes(cnicBack.mimetype || "")) {
                return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.BAD_REQUEST.code, "Invalid file type for CNIC back");
            }
            const outputPath = yield Generic_1.Generic.compressImage(cnicBack.filepath);
            cnicBackUrl = yield Generic_1.Generic.getImagePath({
                tempPath: outputPath,
                filename: cnicBack.originalFilename || "cnicBack",
                basePath,
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const groundOwnerData = {
            fullname,
            contactNo,
            email,
            cnicFrontUrl,
            cnicBackUrl,
            groundLocation,
            paymentMethod,
            password: hashedPassword,
        };
        const newGroundOwner = yield dao_1.default.groundOwnerDAOService.create(groundOwnerData);
        if (!newGroundOwner || typeof newGroundOwner !== "object") {
            throw new Error("Failed to create ground owner");
        }
        const ownerId = (_c = newGroundOwner._id) === null || _c === void 0 ? void 0 : _c.toString();
        if (!ownerId) {
            throw new Error("Ground owner ID is missing");
        }
        const token = (0, jwt_1.generateToken)(ownerId);
        return (0, responseHandler_1.sendResponse)(res, utils_1.HttpStatus.CREATED.code, "Ground owner registered successfully", { user: newGroundOwner, token });
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.INTERNAL_SERVER_ERROR.code, error.message);
    }
});
exports.registerGroundOwner = registerGroundOwner;
const updateGroundOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const form = (0, formidable_1.default)();
        const [fields, files] = yield new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(errors_1.CustomAPIError.response(err.message, utils_1.HttpStatus.BAD_REQUEST.code));
                }
                else {
                    resolve([fields, files]);
                }
            });
        });
        const authReq = req;
        const groundOwnerId = req.params.id;
        if (((_a = authReq.user) === null || _a === void 0 ? void 0 : _a.userId) !== groundOwnerId) {
            return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.BAD_REQUEST.code, "Unauthorized action");
        }
        Object.keys(fields).forEach((key) => {
            if (Array.isArray(fields[key])) {
                fields[key] = fields[key][0];
            }
        });
        const { error, value } = joi_1.default.object({
            fullname: joi_1.default.string().required().label("Full Name"),
            contactNo: joi_1.default.string().required().label("Contact Number"),
            email: joi_1.default.string().email().optional().label("Email"),
            groundLocation: joi_1.default.string().required().label("Ground Location"),
            paymentMethod: joi_1.default.string().required().label("Payment Method"),
            password: joi_1.default.string().min(6).optional().label("Password"),
        }).validate(fields);
        if (error) {
            return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.BAD_REQUEST.code, error.details[0].message);
        }
        const { fullname, contactNo, email, groundLocation, paymentMethod, password, } = value;
        const existingGroundOwner = yield dao_1.default.groundOwnerDAOService.findById(groundOwnerId);
        if (!existingGroundOwner) {
            return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.BAD_REQUEST.code, "Ground owner not found");
        }
        if (email && email !== existingGroundOwner.email) {
            const existingEmail = yield dao_1.default.groundOwnerDAOService.findByAny({
                email,
            });
            if (existingEmail) {
                return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.BAD_REQUEST.code, "Ground owner with this email already exists");
            }
        }
        if (contactNo && contactNo !== existingGroundOwner.contactNo) {
            const existingContactNo = yield dao_1.default.groundOwnerDAOService.findByAny({ contactNo });
            if (existingContactNo) {
                return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.BAD_REQUEST.code, "Ground owner with this contact number already exists");
            }
        }
        const cnicFront = (_b = files.cnicFrontUrl) === null || _b === void 0 ? void 0 : _b[0];
        const cnicBack = (_c = files.cnicBackUrl) === null || _c === void 0 ? void 0 : _c[0];
        const basePath = `${config_1.UPLOAD_BASE_PATH}/groundOwner`;
        let cnicFrontUrl = existingGroundOwner.cnicFrontUrl;
        let cnicBackUrl = existingGroundOwner.cnicBackUrl;
        if (cnicFront) {
            if (!config_1.ALLOWED_FILE_TYPES.includes(cnicFront.mimetype)) {
                return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.BAD_REQUEST.code, "Invalid file type for CNIC front");
            }
            const outputPath = yield Generic_1.Generic.compressImage(cnicFront.filepath);
            cnicFrontUrl = yield Generic_1.Generic.getImagePath({
                tempPath: outputPath,
                filename: cnicFront.originalFilename,
                basePath,
            });
        }
        if (cnicBack) {
            if (!config_1.ALLOWED_FILE_TYPES.includes(cnicBack.mimetype)) {
                return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.BAD_REQUEST.code, "Invalid file type for CNIC back");
            }
            const outputPath = yield Generic_1.Generic.compressImage(cnicBack.filepath);
            cnicBackUrl = yield Generic_1.Generic.getImagePath({
                tempPath: outputPath,
                filename: cnicBack.originalFilename,
                basePath,
            });
        }
        const payload = {
            fullname: fullname || existingGroundOwner.fullname,
            contactNo: contactNo || existingGroundOwner.contactNo,
            email: email || existingGroundOwner.email,
            groundLocation: groundLocation || existingGroundOwner.groundLocation,
            paymentMethod: paymentMethod || existingGroundOwner.paymentMethod,
            cnicFrontUrl,
            cnicBackUrl,
        };
        if (password) {
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            payload.password = hashedPassword;
        }
        const updatedGroundOwner = yield dao_1.default.groundOwnerDAOService.updateByAny({ _id: groundOwnerId }, payload);
        return (0, responseHandler_1.sendResponse)(res, utils_1.HttpStatus.OK.code, "Ground owner updated successfully", updatedGroundOwner);
    }
    catch (error) {
        return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.INTERNAL_SERVER_ERROR.code, error.message);
    }
});
exports.updateGroundOwner = updateGroundOwner;
const getGroundOwnerList = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groundOwners = yield dao_1.default.groundOwnerDAOService.findAll();
        (0, responseHandler_1.sendResponse)(res, 200, "Ground owners fetched successfully", groundOwners);
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendError)(res, 500, "Server Error", error.message);
    }
});
exports.getGroundOwnerList = getGroundOwnerList;
const deleteAllGroundOwners = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield dao_1.default.groundOwnerDAOService.deleteAll();
        return (0, responseHandler_1.sendResponse)(res, 200, "All ground owners deleted successfully");
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.sendError)(res, 500, "Server Error", error.message);
    }
});
exports.deleteAllGroundOwners = deleteAllGroundOwners;
const deleteGroundOwnerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const groundOwner = yield dao_1.default.groundOwnerDAOService.findById(id);
        if (!groundOwner) {
            return (0, responseHandler_1.sendError)(res, 404, "Ground owner not found");
        }
        yield dao_1.default.groundOwnerDAOService.deleteById(id);
        return (0, responseHandler_1.sendResponse)(res, 200, "Ground owner deleted successfully");
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.sendError)(res, 500, "Server Error", error.message);
    }
});
exports.deleteGroundOwnerById = deleteGroundOwnerById;
const getGroundOwnerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const groundOwner = yield dao_1.default.groundOwnerDAOService.findById(id);
        if (!groundOwner) {
            return (0, responseHandler_1.sendError)(res, 404, "Ground owner not found");
        }
        return (0, responseHandler_1.sendResponse)(res, 200, "Ground owner fetched successfully", groundOwner);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.sendError)(res, 500, "Server Error", error.message);
    }
});
exports.getGroundOwnerById = getGroundOwnerById;
