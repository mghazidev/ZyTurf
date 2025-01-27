"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GroundOwnerRepository_1 = __importDefault(require("../../repositories/GroundOwnerRepository"));
const GroundOwnerDaoService_1 = __importDefault(require("./GroundOwnerDaoService"));
const groundOwnerRepository = new GroundOwnerRepository_1.default();
const groundOwnerDAOService = new GroundOwnerDaoService_1.default(groundOwnerRepository);
exports.default = { groundOwnerDAOService };
