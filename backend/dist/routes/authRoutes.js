"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authRoute = (0, express_1.Router)();
authRoute.post("/signup", authController_1.userSignup);
authRoute.post("/user-login", authController_1.userLogin);
exports.default = authRoute;
