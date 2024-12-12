// src/controllers/userController.ts

import { Request, Response } from "express";
import User from "../models/userModel";

// Controller function to fetch all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users); // Respond with users
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
