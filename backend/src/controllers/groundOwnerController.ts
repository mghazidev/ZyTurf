import { Request, Response } from "express";
import { sendResponse, sendError } from "../utils/responseHandler";
import datasources from "../services/dao";
import { IGroundOwner } from "../models/groundOwnerModel";
import Joi from "joi";
import { HttpStatus } from "../utils/utils";
import { CustomAPIError } from "../errors/errors";
import { UPLOAD_BASE_PATH, ALLOWED_FILE_TYPES } from "../config/config";
import { Generic } from "../utils/Generic";
import formidable from "formidable";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { AuthRequest } from "../@types/types";
import GroundOwner from "../models/groundOwnerModel";

const blacklistedTokens = new Set<string>();

export const loginGroundOwner = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    let groundUser: any;

    if (email) {
      groundUser = await GroundOwner.findOne({ email });
    }

    if (!groundUser) {
      return sendError(res, HttpStatus.BAD_REQUEST.code, "Invalid User");
    }

    if (!(await bcrypt.compare(password, groundUser.password))) {
      return sendError(res, HttpStatus.BAD_REQUEST.code, "Invalid password");
    }

    if (!groundUser || !groundUser._id) {
      return sendError(res, HttpStatus.BAD_REQUEST.code, "No user find");
    }

    const token = generateToken(groundUser._id.toString());

    return sendResponse(res, HttpStatus.OK.code, "Login successful", {
      groundUser,
      token,
    });
  } catch (error: any) {
    return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR.code, error.message);
  }
};

export const logoutGroundOwner = async (req: Request, res: Response) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return sendResponse(
        res,
        HttpStatus.BAD_REQUEST.code,
        "No token provided",
        {}
      );
    }

    // Add the token to the blacklist
    blacklistedTokens.add(token);

    // Now that the token is blacklisted, it will be treated as invalid in the future
    return sendResponse(res, HttpStatus.OK.code, "Logout successful", {});
  } catch (error: any) {
    return sendResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR.code,
      error.message,
      {}
    );
  }
};

export const registerGroundOwner = async (req: Request, res: Response) => {
  try {
    const form = formidable();

    // Promise to parse the form and handle fields/files
    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(
            CustomAPIError.response(err.message, HttpStatus.BAD_REQUEST.code)
          );
        } else {
          resolve([fields, files]);
        }
      });
    });

    Object.keys(fields).forEach((key) => {
      if (Array.isArray(fields[key])) {
        fields[key] = fields[key][0];
      }
    });

    const { error, value } = Joi.object<any>({
      fullname: Joi.string().required().label("Full Name"),
      email: Joi.string().email().required().label("Email"),
      contactNo: Joi.string().required().label("Contact Number"),
      groundLocation: Joi.string().required().label("Ground Location"),
      paymentMethod: Joi.string().required().label("Payment Method"),
      password: Joi.string().min(6).required().label("Password"),
    }).validate(fields);

    if (error) {
      return sendError(
        res,
        HttpStatus.BAD_REQUEST.code,
        error.details[0].message
      );
    }

    const {
      fullname,
      contactNo,
      email,
      groundLocation,
      paymentMethod,
      password,
    } = value;

    const existingGroundOwner =
      await datasources.groundOwnerDAOService.findByAny({
        $or: [{ email }, { contactNo }],
      });

    if (existingGroundOwner) {
      return sendResponse(
        res,
        HttpStatus.OK.code,
        "Ground owner already registered",
        existingGroundOwner
      );
    }

    const basePath = `${UPLOAD_BASE_PATH}/groundOwner`;

    let cnicFrontUrl = "";
    let cnicBackUrl = "";

    const cnicFront = files.cnicFrontUrl?.[0];
    const cnicBack = files.cnicBackUrl?.[0];

    if (cnicFront) {
      if (!ALLOWED_FILE_TYPES.includes(cnicFront.mimetype || "")) {
        return sendError(
          res,
          HttpStatus.BAD_REQUEST.code,
          "Invalid file type for CNIC front"
        );
      }
      const outputPath = await Generic.compressImage(cnicFront.filepath);
      cnicFrontUrl = await Generic.getImagePath({
        tempPath: outputPath,
        filename: cnicFront.originalFilename || "cnicFront",
        basePath,
      });
    }

    if (cnicBack) {
      if (!ALLOWED_FILE_TYPES.includes(cnicBack.mimetype || "")) {
        return sendError(
          res,
          HttpStatus.BAD_REQUEST.code,
          "Invalid file type for CNIC back"
        );
      }
      const outputPath = await Generic.compressImage(cnicBack.filepath);
      cnicBackUrl = await Generic.getImagePath({
        tempPath: outputPath,
        filename: cnicBack.originalFilename || "cnicBack",
        basePath,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const groundOwnerData = {
      fullname,
      contactNo,
      email,
      cnicFrontUrl,
      cnicBackUrl,
      groundLocation,
      paymentMethod,
      password: hashedPassword,
    };

    const newGroundOwner = await datasources.groundOwnerDAOService.create(
      groundOwnerData as IGroundOwner
    );

    if (!newGroundOwner || typeof newGroundOwner !== "object") {
      throw new Error("Failed to create ground owner");
    }

    const ownerId = (newGroundOwner as IGroundOwner)._id?.toString();

    if (!ownerId) {
      throw new Error("Ground owner ID is missing");
    }

    const token = generateToken(ownerId);

    return sendResponse(
      res,
      HttpStatus.CREATED.code,
      "Ground owner registered successfully",
      { user: newGroundOwner, token }
    );
  } catch (error: any) {
    console.error(error);
    return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR.code, error.message);
  }
};

export const updateGroundOwner = async (req: Request, res: Response) => {
  try {
    const form = formidable();

    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(
            CustomAPIError.response(err.message, HttpStatus.BAD_REQUEST.code)
          );
        } else {
          resolve([fields, files]);
        }
      });
    });

    const authReq = req as AuthRequest;

    const groundOwnerId = req.params.id;

    if (authReq.user?.userId !== groundOwnerId) {
      return sendError(res, HttpStatus.BAD_REQUEST.code, "Unauthorized action");
    }

    Object.keys(fields).forEach((key) => {
      if (Array.isArray(fields[key])) {
        fields[key] = fields[key][0];
      }
    });

    const { error, value } = Joi.object<any>({
      fullname: Joi.string().required().label("Full Name"),
      contactNo: Joi.string().required().label("Contact Number"),
      email: Joi.string().email().optional().label("Email"),
      groundLocation: Joi.string().required().label("Ground Location"),
      paymentMethod: Joi.string().required().label("Payment Method"),
      password: Joi.string().min(6).optional().label("Password"),
    }).validate(fields);

    if (error) {
      return sendError(
        res,
        HttpStatus.BAD_REQUEST.code,
        error.details[0].message
      );
    }

    const {
      fullname,
      contactNo,
      email,
      groundLocation,
      paymentMethod,
      password,
    } = value;

    const existingGroundOwner =
      await datasources.groundOwnerDAOService.findById(groundOwnerId);
    if (!existingGroundOwner) {
      return sendError(
        res,
        HttpStatus.BAD_REQUEST.code,
        "Ground owner not found"
      );
    }

    if (email && email !== existingGroundOwner.email) {
      const existingEmail = await datasources.groundOwnerDAOService.findByAny({
        email,
      });
      if (existingEmail) {
        return sendError(
          res,
          HttpStatus.BAD_REQUEST.code,
          "Ground owner with this email already exists"
        );
      }
    }

    if (contactNo && contactNo !== existingGroundOwner.contactNo) {
      const existingContactNo =
        await datasources.groundOwnerDAOService.findByAny({ contactNo });
      if (existingContactNo) {
        return sendError(
          res,
          HttpStatus.BAD_REQUEST.code,
          "Ground owner with this contact number already exists"
        );
      }
    }

    const cnicFront = files.cnicFrontUrl?.[0];
    const cnicBack = files.cnicBackUrl?.[0];
    const basePath = `${UPLOAD_BASE_PATH}/groundOwner`;

    let cnicFrontUrl = existingGroundOwner.cnicFrontUrl;
    let cnicBackUrl = existingGroundOwner.cnicBackUrl;

    if (cnicFront) {
      if (!ALLOWED_FILE_TYPES.includes(cnicFront.mimetype as string)) {
        return sendError(
          res,
          HttpStatus.BAD_REQUEST.code,
          "Invalid file type for CNIC front"
        );
      }
      const outputPath = await Generic.compressImage(cnicFront.filepath);
      cnicFrontUrl = await Generic.getImagePath({
        tempPath: outputPath,
        filename: cnicFront.originalFilename as string,
        basePath,
      });
    }

    if (cnicBack) {
      if (!ALLOWED_FILE_TYPES.includes(cnicBack.mimetype as string)) {
        return sendError(
          res,
          HttpStatus.BAD_REQUEST.code,
          "Invalid file type for CNIC back"
        );
      }
      const outputPath = await Generic.compressImage(cnicBack.filepath);
      cnicBackUrl = await Generic.getImagePath({
        tempPath: outputPath,
        filename: cnicBack.originalFilename as string,
        basePath,
      });
    }
    const payload: Partial<IGroundOwner> = {
      fullname: fullname || existingGroundOwner.fullname,
      contactNo: contactNo || existingGroundOwner.contactNo,
      email: email || existingGroundOwner.email,
      groundLocation: groundLocation || existingGroundOwner.groundLocation,
      paymentMethod: paymentMethod || existingGroundOwner.paymentMethod,
      cnicFrontUrl,
      cnicBackUrl,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      payload.password = hashedPassword;
    }

    const updatedGroundOwner =
      await datasources.groundOwnerDAOService.updateByAny(
        { _id: groundOwnerId },
        payload
      );

    return sendResponse(
      res,
      HttpStatus.OK.code,
      "Ground owner updated successfully",
      updatedGroundOwner
    );
  } catch (error: any) {
    return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR.code, error.message);
  }
};

export const getGroundOwnerList = async (_req: Request, res: Response) => {
  try {
    const groundOwners = await datasources.groundOwnerDAOService.findAll();
    sendResponse(res, 200, "Ground owners fetched successfully", groundOwners);
  } catch (error: any) {
    console.error(error);
    sendError(res, 500, "Server Error", error.message);
  }
};

export const deleteAllGroundOwners = async (_req: Request, res: Response) => {
  try {
    await datasources.groundOwnerDAOService.deleteAll();
    return sendResponse(res, 200, "All ground owners deleted successfully");
  } catch (error: any) {
    console.error(error);
    return sendError(res, 500, "Server Error", error.message);
  }
};

export const deleteGroundOwnerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const groundOwner = await datasources.groundOwnerDAOService.findById(id);
    if (!groundOwner) {
      return sendError(res, 404, "Ground owner not found");
    }

    await datasources.groundOwnerDAOService.deleteById(id);
    return sendResponse(res, 200, "Ground owner deleted successfully");
  } catch (error: any) {
    console.error(error);
    return sendError(res, 500, "Server Error", error.message);
  }
};

export const getGroundOwnerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const groundOwner = await datasources.groundOwnerDAOService.findById(id);
    if (!groundOwner) {
      return sendError(res, 404, "Ground owner not found");
    }
    return sendResponse(
      res,
      200,
      "Ground owner fetched successfully",
      groundOwner
    );
  } catch (error: any) {
    console.error(error);
    return sendError(res, 500, "Server Error", error.message);
  }
};
