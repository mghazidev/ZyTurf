import { Response } from "express";
export const HttpStatus = {
  OK: { code: 200, message: "OK" },
  CREATED: { code: 201, message: "Created" },
  BAD_REQUEST: { code: 400, message: "Bad Request" },
  INTERNAL_SERVER_ERROR: { code: 500, message: "Internal Server Error" },
};

export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  error?: any
) => {
  return res.status(statusCode).json({ success: false, message, error });
};
