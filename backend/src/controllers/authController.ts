import { Request, Response } from "express";
import User from "../models/authModel";
import GroundOwner from "../models/groundOwnerModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendResponse, sendError } from "../utils/responseHandler";

/**
 * @route
 * @desc
 */
export const userSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return sendError(res, 400, "Email already registered");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    return sendResponse(res, 201, "User registered successfully", newUser);
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

/**
 * @route
 * @desc
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    let role = "customer";

    if (!user) {
      user = await GroundOwner.findOne({ contactNo: email });
      role = "admin";
    }

    if (!user) {
      return sendError(res, 400, "Invalid credentials");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return sendError(res, 400, "Invalid credentials");
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return sendResponse(res, 200, "Login successful", { token, role });
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};
