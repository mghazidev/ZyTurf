"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groundOwnerController_1 = require("../controllers/groundOwnerController");
const groundOwnerRoutes = (0, express_1.Router)();
groundOwnerRoutes.post("/register", groundOwnerController_1.registerGroundOwner);
groundOwnerRoutes.get("/get-owners", groundOwnerController_1.getGroundOwnerList);
exports.default = groundOwnerRoutes;
