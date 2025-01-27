import { Request, Response } from "express";
import { sendResponse, sendError } from "../utils/responseHandler";
import { uploadFiles, UploadResult } from "../utils/multerUploader";
import { groundOwnerValidationSchema } from "../validations/groundOwnerValidation";
import datasources from "../services/dao";
import { IGroundOwner } from "../models/groundOwnerModel";

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
