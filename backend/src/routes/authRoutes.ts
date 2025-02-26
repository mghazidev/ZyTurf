import { Router } from "express";
import {
  userSignup,
  userLogin,
  getAllUsers,
  deleteAllUsers,
} from "../controllers/authController";

const authRoute = Router();

authRoute.post("/signup", userSignup);
authRoute.post("/user-login", userLogin);
authRoute.get("/get-users", getAllUsers);
authRoute.delete("/delete-users", deleteAllUsers);

export default authRoute;
