"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userContoller_1 = require("../controllers/userContoller");
const router = (0, express_1.Router)();
router.get("/", userContoller_1.getUsers);
exports.default = router;
