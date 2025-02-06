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

/**
 * Ground Owner Login
 */
export const groundOwnerLogin = async (req: Request, res: Response) => {
  try {
    const { email, phone, password } = req.body;
    let groundOwner: any;

    if (email) {
      groundOwner = await GroundOwner.findOne({ email });
    } else if (phone) {
      groundOwner = await GroundOwner.findOne({ contactNo: phone });
    }

    if (
      !groundOwner ||
      !(await bcrypt.compare(password, groundOwner.password))
    ) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: groundOwner._id, role: "ground-owner" },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return sendResponse(res, 200, "Login successful", {
      token,
      role: "ground-owner",
    });
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};
