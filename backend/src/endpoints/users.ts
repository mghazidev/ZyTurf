// src/endpoints/users.ts

import { Router } from "express";
import userRoutes from "../routes/userRoutes"; // Import user routes

const router = Router();

// Register the user routes for /api/v1/users
router.use("/users", userRoutes);

export default router;
