import dotenv from "dotenv";

dotenv.config();

export const UPLOAD_BASE_PATH = "uploads";
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

export const JWT_SECRET =
  "2094beff9bde091db51ebc854cd232d75d4fc878bd4d6af11aa153240dfbb612704097d1d0f7b9d3eb8baf24d897d7048fb16d3003e04887c24f76afb2a20bb1";
