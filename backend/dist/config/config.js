"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.ALLOWED_FILE_TYPES = exports.UPLOAD_BASE_PATH = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.UPLOAD_BASE_PATH = "uploads";
exports.ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
];
exports.JWT_SECRET = "2094beff9bde091db51ebc854cd232d75d4fc878bd4d6af11aa153240dfbb612704097d1d0f7b9d3eb8baf24d897d7048fb16d3003e04887c24f76afb2a20bb1";
