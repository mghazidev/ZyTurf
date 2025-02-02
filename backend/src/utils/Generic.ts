import fs from "fs";
import path from "path";
import { promisify } from "util";
import sharp from "sharp";
import { v4 } from "uuid"; // Assuming you're using the uuid package for unique file names

interface IGetImagePath {
  basePath: string;
  filename: string;
  tempPath: string;
}

// Promisify fs methods
const mkdir = promisify(fs.mkdir);
const rename = promisify(fs.rename);
const fileExist = async (filePath: string) => fs.existsSync(filePath); // Custom file exist function

// Compress Image Logic
const compressImage = async (imagePath: string): Promise<string> => {
  const outputPath = path.join("uploads", "image.webp"); // Set output path to a folder inside your server

  try {
    // Resize and compress the image using sharp
    await sharp(imagePath)
      .resize(700, 620) // Adjust the size as needed
      .webp({ quality: 80 }) // Save the image as WebP with 80 quality
      .toFile(outputPath); // Save the output image to the file system

    return outputPath;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error; // Rethrow the error to handle it upstream
  }
};

// Get Image Path Logic
const getImagePath = async (params: IGetImagePath): Promise<string> => {
  const exists = await fileExist(params.basePath);

  // If the directory doesn't exist, create it
  if (!exists) {
    await mkdir(params.basePath, { recursive: true });
  }

  const newFileName = `${v4()}${path.extname(params.filename)}`;
  const newPath = path.join(params.basePath, newFileName);

  // Rename the file (move it to the new path)
  await rename(params.tempPath, newPath);

  return newPath.replace(/\\/g, "/");
};

// Export an object containing the functions
export const Generic = {
  compressImage,
  getImagePath,
};
