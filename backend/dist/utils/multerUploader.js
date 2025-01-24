"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFiles = void 0;
const multer_1 = __importDefault(require("multer"));
// Configure Multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Directory for storing files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueSuffix);
    },
});
// Initialize Multer with the configured storage
const upload = (0, multer_1.default)({ storage });
// File upload handler
const uploadFiles = (req, res, fields) => {
    return new Promise((resolve, reject) => {
        const multiUpload = upload.fields(fields.map((field) => ({ name: field })));
        multiUpload(req, res, (err) => {
            if (err) {
                console.error("File upload error:", err);
                return reject(err);
            }
            // Collect uploaded file paths
            const files = {};
            fields.forEach((field) => {
                if (req.files &&
                    req.files[field]) {
                    files[field] = req.files[field][0].path;
                }
            });
            resolve({ files });
        });
    });
};
exports.uploadFiles = uploadFiles;
