import { Router } from "express";
import { userSignup, userLogin } from "../controllers/authController";

const authRoute = Router();

authRoute.post("/signup", userSignup);
authRoute.post("/user-login", userLogin);

export default authRoute;
