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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroundOwnerList = exports.registerGroundOwner = void 0;
const groundOwnerService_1 = require("../services/groundOwnerService");
const responseHandler_1 = require("../utils/responseHandler");
const multerUploader_1 = require("../utils/multerUploader");
const registerGroundOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadResult = yield (0, multerUploader_1.uploadFiles)(req, res, [
            "cnicFront",
            "cnicBack",
        ]);
        if (!uploadResult) {
            return (0, responseHandler_1.sendError)(res, 400, "File upload failed");
        }
        const { fullname, contactNo, groundLocation, paymentMethod } = req.body;
        const cnicFrontUrl = uploadResult.files.cnicFront;
        const cnicBackUrl = uploadResult.files.cnicBack;
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
        const newGroundOwner = yield (0, groundOwnerService_1.createGroundOwner)(groundOwnerData);
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
        const groundOwners = yield (0, groundOwnerService_1.getGroundOwners)();
        (0, responseHandler_1.sendResponse)(res, 200, "Ground owners fetched successfully", groundOwners);
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendError)(res, 500, "Server Error", error.message);
    }
});
exports.getGroundOwnerList = getGroundOwnerList;
