// src/routes/userRoutes.ts

import { Router } from "express";
import { getUsers } from "../controllers/userContoller";

// Create a router for user-related routes
const router = Router();

// Define the route to get users
router.get("/", getUsers);

export default router;
