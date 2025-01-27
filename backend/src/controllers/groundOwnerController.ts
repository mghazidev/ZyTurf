import { Request, Response } from "express";
import { sendResponse, sendError } from "../utils/responseHandler";
import { uploadFiles, UploadResult } from "../utils/multerUploader";
import { groundOwnerValidationSchema } from "../validations/groundOwnerValidation";
import datasources from "../services/dao";
import { IGroundOwner } from "../models/groundOwnerModel";
import Joi from "joi";

export const registerGroundOwner = async (req: Request, res: Response) => {
  try {
    const uploadResult: UploadResult = await uploadFiles(req, res, [
      "cnicFrontUrl",
      "cnicBackUrl",
    ]);
    if (!uploadResult) {
      return sendError(res, 400, "File upload failed");
    }

    const { fullname, contactNo, groundLocation, paymentMethod } = req.body;
    const cnicFrontUrl = uploadResult.files.cnicFrontUrl;
    const cnicBackUrl = uploadResult.files.cnicBackUrl;

    if (
      !fullname ||
      !contactNo ||
      !cnicFrontUrl ||
      !cnicBackUrl ||
      !groundLocation ||
      !paymentMethod
    ) {
      return sendError(res, 400, "All fields are required");
    }

    const groundOwnerData = {
      fullname,
      contactNo,
      cnicFrontUrl,
      cnicBackUrl,
      groundLocation,
      paymentMethod,
    };

    const newGroundOwner = await datasources.groundOwnerDAOService.create(
      groundOwnerData as IGroundOwner
    );
    return sendResponse(
      res,
      201,
      "Ground owner registered successfully",
      newGroundOwner
    );
  } catch (error: any) {
    console.error(error);
    return sendError(res, 500, "Server Error", error.message);
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

export const updateGroundOwnerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error, value } = Joi.object({
      fullname: Joi.string().optional().label("Full Name"),
      contactNo: Joi.string().optional().label("Contact No"),
      cnicFrontUrl: Joi.string().optional().label("CNIC Front URL"),
      cnicBackUrl: Joi.string().optional().label("CNIC Back URL"),
      groundLocation: Joi.string().optional().label("Ground Location"),
      paymentMethod: Joi.string().optional().label("Payment Method"),
    }).validate(req.body);
    if (error) {
      return sendError(res, 400, "Validation Error", error.details[0].message);
    }
    const existingGroundOwner =
      await datasources.groundOwnerDAOService.findById(id);
    if (!existingGroundOwner) {
      return sendError(res, 404, "Ground owner not found");
    }
    const updatedGroundOwner =
      await datasources.groundOwnerDAOService.updateByAny({ _id: id }, value);
    if (!updatedGroundOwner) {
      return sendError(res, 404, "Ground owner not found");
    }

    return sendResponse(
      res,
      200,
      "Ground owner updated successfully",
      updatedGroundOwner
    );
  } catch (error: any) {
    console.error(error);
    return sendError(res, 500, "Server Error", error.message);
  }
};
