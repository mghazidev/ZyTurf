import multer, { StorageEngine } from "multer";
import { Request, Response } from "express";

export type UploadResult = {
  files: { [key: string]: string };
};

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

export const uploadFiles = (
  req: Request,
  res: Response,
  fields: string[]
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const multiUpload = upload.fields(fields.map((field) => ({ name: field })));

    multiUpload(req, res, (err: any) => {
      if (err) {
        console.error("File upload error:", err);
        return reject(err);
      }

      // Collect uploaded file paths
      const files: { [key: string]: string } = {};
      fields.forEach((field) => {
        if (
          req.files &&
          (req.files as { [fieldname: string]: Express.Multer.File[] })[field]
        ) {
          files[field] = (
            req.files as { [fieldname: string]: Express.Multer.File[] }
          )[field][0].path;
        }
      });

      resolve({ files });
    });
  });
};
