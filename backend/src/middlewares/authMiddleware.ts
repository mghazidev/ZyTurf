import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";
import { sendError } from "../utils/responseHandler";
import { HttpStatus } from "../utils/utils";
import { AuthRequest } from "../@types/types"; // Import the extended type
const blacklistedTokens = new Set<string>();
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return sendError(res, HttpStatus.BAD_REQUEST.code, "Access Denied");
  }

  // Check if the token is blacklisted
  if (blacklistedTokens.has(token)) {
    return sendError(
      res,
      HttpStatus.BAD_REQUEST.code,
      "Token has been logged out"
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.user = { userId: decoded.userId }; // Now TypeScript recognizes `req.user`
    next();
  } catch (error) {
    return sendError(res, HttpStatus.BAD_REQUEST.code, "Invalid Token");
  }
};
