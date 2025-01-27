import { Router } from "express";
import {
  registerGroundOwner,
  getGroundOwnerList,
  deleteAllGroundOwners,
  deleteGroundOwnerById,
  getGroundOwnerById,
  updateGroundOwnerById,
} from "../controllers/groundOwnerController";

const groundOwnerRoutes = Router();

groundOwnerRoutes.post("/register", registerGroundOwner);
groundOwnerRoutes.get("/get-owners", getGroundOwnerList);
groundOwnerRoutes.delete("/delete-all", deleteAllGroundOwners);
groundOwnerRoutes.delete("/:id", deleteGroundOwnerById);
groundOwnerRoutes.get("/:id", getGroundOwnerById);
groundOwnerRoutes.put("/:id", updateGroundOwnerById);

export default groundOwnerRoutes;
