import { Router } from "express";
import {
  userSignup,
  userLogin,
  groundOwnerLogin,
} from "../controllers/authController";

const authRoute = Router();

authRoute.post("/signup", userSignup);
authRoute.post("/user-login", userLogin);
authRoute.post("/ground-owner-login", groundOwnerLogin);

export default authRoute;
