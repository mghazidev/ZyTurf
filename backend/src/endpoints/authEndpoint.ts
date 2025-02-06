import { Router } from "express";
import authRoute from "../routes/authRoutes";

const authEndpoint = Router();

authEndpoint.use("/auth", authRoute);

export default authEndpoint;
