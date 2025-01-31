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
exports.updateGroundOwnerById = exports.getGroundOwnerById = exports.deleteGroundOwnerById = exports.deleteAllGroundOwners = exports.getGroundOwnerList = exports.registerGroundOwner = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const dao_1 = __importDefault(require("../services/dao"));
const joi_1 = __importDefault(require("joi"));
const utils_1 = require("../utils/utils");
const errors_1 = require("../errors/errors");
const config_1 = require("../config/config");
const Generic_1 = require("../utils/Generic");
const formidable_1 = __importDefault(require("formidable"));
const registerGroundOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = (0, formidable_1.default)();
        // Promise to parse the form and handle fields/files
        const [fields, files] = yield new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.error("Error parsing form:", err);
                    reject(errors_1.CustomAPIError.response(err.message, utils_1.HttpStatus.BAD_REQUEST.code));
                }
                else {
                    resolve([fields, files]);
                }
            });
        });
        // Convert arrays to strings if needed (formidable may send arrays)
        Object.keys(fields).forEach((key) => {
            if (Array.isArray(fields[key])) {
                fields[key] = fields[key][0]; // Convert array to string
            }
        });
        // Validate incoming request body using Joi
        const { error, value } = joi_1.default.object({
            fullname: joi_1.default.string().required().label("Full Name"),
            contactNo: joi_1.default.string().required().label("Contact Number"),
            groundLocation: joi_1.default.string().required().label("Ground Location"),
            paymentMethod: joi_1.default.string().required().label("Payment Method"),
        }).validate(fields);
        if (error) {
            return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.BAD_REQUEST.code, error.details[0].message);
        }
        const { fullname, contactNo, groundLocation, paymentMethod } = value;
        // Check if a ground owner with the same contact number already exists
        const existingGroundOwner = yield dao_1.default.groundOwnerDAOService.findByAny({ contactNo });
        if (existingGroundOwner) {
            return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.BAD_REQUEST.code, "Ground owner with this contact number already exists");
        }
        // Handle file uploads for CNIC front and back
        const basePath = `${config_1.UPLOAD_BASE_PATH}/groundOwner`;
        let cnicFrontUrl = "";
        let cnicBackUrl = "";
        const cnicFront = files.cnicFrontUrl;
        const cnicBack = files.cnicBackUrl;
        // Validate and handle CNIC front file
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
        // Validate and handle CNIC back file
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
        // Prepare data for the new ground owner
        const groundOwnerData = {
            fullname,
            contactNo,
            cnicFrontUrl,
            cnicBackUrl,
            groundLocation,
            paymentMethod,
        };
        // Create the new ground owner entry
        const newGroundOwner = yield dao_1.default.groundOwnerDAOService.create(groundOwnerData);
        return (0, responseHandler_1.sendResponse)(res, utils_1.HttpStatus.CREATED.code, "Ground owner registered successfully", newGroundOwner);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.sendError)(res, utils_1.HttpStatus.INTERNAL_SERVER_ERROR.code, error.message);
    }
});
exports.registerGroundOwner = registerGroundOwner;
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
const updateGroundOwnerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { error, value } = joi_1.default.object({
            fullname: joi_1.default.string().optional().label("Full Name"),
            contactNo: joi_1.default.string().optional().label("Contact No"),
            cnicFrontUrl: joi_1.default.string().optional().label("CNIC Front URL"),
            cnicBackUrl: joi_1.default.string().optional().label("CNIC Back URL"),
            groundLocation: joi_1.default.string().optional().label("Ground Location"),
            paymentMethod: joi_1.default.string().optional().label("Payment Method"),
        }).validate(req.body);
        if (error) {
            return (0, responseHandler_1.sendError)(res, 400, "Validation Error", error.details[0].message);
        }
        const existingGroundOwner = yield dao_1.default.groundOwnerDAOService.findById(id);
        if (!existingGroundOwner) {
            return (0, responseHandler_1.sendError)(res, 404, "Ground owner not found");
        }
        const updatedGroundOwner = yield dao_1.default.groundOwnerDAOService.updateByAny({ _id: id }, value);
        if (!updatedGroundOwner) {
            return (0, responseHandler_1.sendError)(res, 404, "Ground owner not found");
        }
        return (0, responseHandler_1.sendResponse)(res, 200, "Ground owner updated successfully", updatedGroundOwner);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.sendError)(res, 500, "Server Error", error.message);
    }
});
exports.updateGroundOwnerById = updateGroundOwnerById;
