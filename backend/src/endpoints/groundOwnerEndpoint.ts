import { Router } from "express";
import groundOwnerRoutes from "../routes/groundOwnerRoutes";

const router = Router();

router.use("/ground-owner", groundOwnerRoutes);

export default router;
