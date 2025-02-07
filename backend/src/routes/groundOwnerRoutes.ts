import { Router } from "express";
import {
  registerGroundOwner,
  getGroundOwnerList,
  deleteAllGroundOwners,
  deleteGroundOwnerById,
  getGroundOwnerById,
  updateGroundOwner,
  loginGroundOwner,
  logoutGroundOwner,
} from "../controllers/groundOwnerController";
import { authMiddleware } from "../middlewares/authMiddleware";

const groundOwnerRoutes = Router();

groundOwnerRoutes.post("/register", registerGroundOwner);
groundOwnerRoutes.post("/login", loginGroundOwner);
groundOwnerRoutes.post("/logout", authMiddleware, logoutGroundOwner);
groundOwnerRoutes.get("/get-owners", authMiddleware, getGroundOwnerList);
groundOwnerRoutes.delete("/delete-all", authMiddleware, deleteAllGroundOwners);
groundOwnerRoutes.delete("/:id", authMiddleware, deleteGroundOwnerById);
groundOwnerRoutes.get("/:id", authMiddleware, getGroundOwnerById);
groundOwnerRoutes.put("/:id", authMiddleware, updateGroundOwner);

export default groundOwnerRoutes;
