"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groundOwnerValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.groundOwnerValidationSchema = joi_1.default.object({
    fullname: joi_1.default.string().min(3).max(50).required().messages({
        "string.empty": "Fullname is required",
        "string.min": "Fullname must be at least 3 characters",
        "string.max": "Fullname must not exceed 50 characters",
    }),
    contactNo: joi_1.default.string()
        .pattern(/^[0-9]{10,12}$/)
        .required()
        .messages({
        "string.pattern.base": "Contact number must be between 10-12 digits",
    }),
    groundLocation: joi_1.default.string().required().messages({
        "string.empty": "Ground location is required",
    }),
    paymentMethod: joi_1.default.string()
        .valid("Cash", "Card", "Online")
        .required()
        .messages({
        "any.only": "Payment method must be 'Cash', 'Card', or 'Online'",
    }),
    cnicFrontUrl: joi_1.default.string().required().messages({
        "string.empty": "CNIC front image is required",
    }),
    cnicBackUrl: joi_1.default.string().required().messages({
        "string.empty": "CNIC back image is required",
    }),
});
