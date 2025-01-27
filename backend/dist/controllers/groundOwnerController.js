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
const multerUploader_1 = require("../utils/multerUploader");
const dao_1 = __importDefault(require("../services/dao"));
const joi_1 = __importDefault(require("joi"));
const registerGroundOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadResult = yield (0, multerUploader_1.uploadFiles)(req, res, [
            "cnicFrontUrl",
            "cnicBackUrl",
        ]);
        if (!uploadResult) {
            return (0, responseHandler_1.sendError)(res, 400, "File upload failed");
        }
        const { fullname, contactNo, groundLocation, paymentMethod } = req.body;
        const cnicFrontUrl = uploadResult.files.cnicFrontUrl;
        const cnicBackUrl = uploadResult.files.cnicBackUrl;
        if (!fullname ||
            !contactNo ||
            !cnicFrontUrl ||
            !cnicBackUrl ||
            !groundLocation ||
            !paymentMethod) {
            return (0, responseHandler_1.sendError)(res, 400, "All fields are required");
        }
        const groundOwnerData = {
            fullname,
            contactNo,
            cnicFrontUrl,
            cnicBackUrl,
            groundLocation,
            paymentMethod,
        };
        const newGroundOwner = yield dao_1.default.groundOwnerDAOService.create(groundOwnerData);
        return (0, responseHandler_1.sendResponse)(res, 201, "Ground owner registered successfully", newGroundOwner);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.sendError)(res, 500, "Server Error", error.message);
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
