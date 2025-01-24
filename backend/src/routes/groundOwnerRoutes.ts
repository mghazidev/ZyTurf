import { Router } from "express";
import {
  registerGroundOwner,
  getGroundOwnerList,
} from "../controllers/groundOwnerController";

const groundOwnerRoutes = Router();

groundOwnerRoutes.post("/register", registerGroundOwner);
groundOwnerRoutes.get("/get-owners", getGroundOwnerList);

export default groundOwnerRoutes;
