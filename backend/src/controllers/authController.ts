import { Request, Response } from "express";
import User from "../models/authModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendResponse, sendError } from "../utils/responseHandler";

/**siguser-
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

    const token = jwt.sign(
      { id: newUser._id, role: "customer" },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return sendResponse(res, 201, "User registered successfully", {
      user: newUser,
      token,
    });
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

/**
 * @route
 * @desc
 */
export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, phone, password } = req.body;
    let user: any;

    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return sendError(res, 400, "Invalid credentials");
    }

    // Compare password
    if (!(await bcrypt.compare(password, user.password))) {
      return sendError(res, 400, "Invalid credentials");
    }

    // Generate JWT token for regular user
    const token = jwt.sign(
      { id: user._id, role: "customer" },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return sendResponse(res, 200, "Login successful", {
      token,
      role: "customer",
    });
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, "-password");
    return sendResponse(res, 200, "All user fetched successfully", users);
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await User.deleteMany({});
    return sendResponse(
      res,
      200,
      `${result.deletedCount} users deleted successfully`
    );
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};
