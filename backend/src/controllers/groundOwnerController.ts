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

    // Convert arrays to strings if needed (formidable may send arrays)
    Object.keys(fields).forEach((key) => {
      if (Array.isArray(fields[key])) {
        fields[key] = fields[key][0]; // Convert array to string
      }
    });

    // Validate incoming request body using Joi
    const { error, value } = Joi.object<any>({
      fullname: Joi.string().required().label("Full Name"),
      contactNo: Joi.string().required().label("Contact Number"),
      groundLocation: Joi.string().required().label("Ground Location"),
      paymentMethod: Joi.string().required().label("Payment Method"),
    }).validate(fields);

    if (error) {
      return sendError(
        res,
        HttpStatus.BAD_REQUEST.code,
        error.details[0].message
      );
    }

    const { fullname, contactNo, groundLocation, paymentMethod } = value;

    // Check if a ground owner with the same contact number already exists
    const existingGroundOwner =
      await datasources.groundOwnerDAOService.findByAny({ contactNo });
    if (existingGroundOwner) {
      return sendError(
        res,
        HttpStatus.BAD_REQUEST.code,
        "Ground owner with this contact number already exists"
      );
    }

    // Handle file uploads for CNIC front and back
    const basePath = `${UPLOAD_BASE_PATH}/groundOwner`;

    let cnicFrontUrl = "";
    let cnicBackUrl = "";

    const cnicFront = files.cnicFrontUrl?.[0];
    const cnicBack = files.cnicBackUrl?.[0];

    // Validate and handle CNIC front file
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

    // Validate and handle CNIC back file
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

    // Prepare data for the new ground owner
    const groundOwnerData = {
      fullname,
      contactNo,
      cnicFrontUrl,
      cnicBackUrl,
      groundLocation,
      paymentMethod,
    };

    // Create the new ground owner entry
    const newGroundOwner = await datasources.groundOwnerDAOService.create(
      groundOwnerData as IGroundOwner
    );

    return sendResponse(
      res,
      HttpStatus.CREATED.code,
      "Ground owner registered successfully",
      newGroundOwner
    );
  } catch (error: any) {
    console.error(error);
    return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR.code, error.message);
  }
};

export const updateGroundOwner = async (req: Request, res: Response) => {
  try {
    const form = formidable();

    // Parse the form
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

    // Extract groundOwnerId from params
    const groundOwnerId = req.params.id;

    // Convert arrays to strings if needed (formidable may send arrays)
    Object.keys(fields).forEach((key) => {
      if (Array.isArray(fields[key])) {
        fields[key] = fields[key][0]; // Convert array to string
      }
    });

    // Validate fields
    const { error, value } = Joi.object<any>({
      fullname: Joi.string().required().label("Full Name"),
      contactNo: Joi.string().required().label("Contact Number"),
      groundLocation: Joi.string().required().label("Ground Location"),
      paymentMethod: Joi.string().required().label("Payment Method"),
    }).validate(fields);

    if (error) {
      return sendError(
        res,
        HttpStatus.BAD_REQUEST.code,
        error.details[0].message
      );
    }

    const { fullname, contactNo, groundLocation, paymentMethod } = value;

    // Fetch the existing Ground Owner details
    const existingGroundOwner =
      await datasources.groundOwnerDAOService.findById(groundOwnerId);
    if (!existingGroundOwner) {
      return sendError(
        res,
        HttpStatus.BAD_REQUEST.code,
        "Ground owner not found"
      );
    }

    // Handle file uploads (CNIC front and back)
    const cnicFront = files.cnicFrontUrl?.[0];
    const cnicBack = files.cnicBackUrl?.[0];
    const basePath = `${UPLOAD_BASE_PATH}/groundOwner`;

    let cnicFrontUrl = existingGroundOwner.cnicFrontUrl; // default to existing URL if no new file
    let cnicBackUrl = existingGroundOwner.cnicBackUrl; // default to existing URL if no new file

    // Validate and handle CNIC front file
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

    // Validate and handle CNIC back file
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

    // Prepare the payload for the update
    const payload: Partial<IGroundOwner> = {
      fullname: fullname || existingGroundOwner.fullname,
      contactNo: contactNo || existingGroundOwner.contactNo,
      groundLocation: groundLocation || existingGroundOwner.groundLocation,
      paymentMethod: paymentMethod || existingGroundOwner.paymentMethod,
      cnicFrontUrl, // New or existing URL for CNIC front
      cnicBackUrl, // New or existing URL for CNIC back
    };

    // Update Ground Owner in the database
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
    console.error(error);
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
