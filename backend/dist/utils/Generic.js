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
exports.Generic = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid"); // Assuming you're using the uuid package for unique file names
// Promisify fs methods
const mkdir = (0, util_1.promisify)(fs_1.default.mkdir);
const rename = (0, util_1.promisify)(fs_1.default.rename);
const fileExist = (filePath) => __awaiter(void 0, void 0, void 0, function* () { return fs_1.default.existsSync(filePath); }); // Custom file exist function
// Compress Image Logic
const compressImage = (imagePath) => __awaiter(void 0, void 0, void 0, function* () {
    const outputPath = path_1.default.join("uploads", "image.webp"); // Set output path to a folder inside your server
    try {
        // Resize and compress the image using sharp
        yield (0, sharp_1.default)(imagePath)
            .resize(700, 620) // Adjust the size as needed
            .webp({ quality: 80 }) // Save the image as WebP with 80 quality
            .toFile(outputPath); // Save the output image to the file system
        return outputPath;
    }
    catch (error) {
        console.error("Error compressing image:", error);
        throw error; // Rethrow the error to handle it upstream
    }
});
// Get Image Path Logic
const getImagePath = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield fileExist(params.basePath);
    // If the directory doesn't exist, create it
    if (!exists) {
        yield mkdir(params.basePath, { recursive: true });
    }
    const newFileName = `${(0, uuid_1.v4)()}${path_1.default.extname(params.filename)}`;
    const newPath = path_1.default.join(params.basePath, newFileName);
    // Rename the file (move it to the new path)
    yield rename(params.tempPath, newPath);
    return newPath.replace(/\\/g, "/");
});
// Export an object containing the functions
exports.Generic = {
    compressImage,
    getImagePath,
};
