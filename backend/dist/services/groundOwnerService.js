"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroundOwners = exports.createGroundOwner = void 0;
const groundOwnerModel_1 = __importDefault(require("../models/groundOwnerModel"));
const createGroundOwner = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newGroundOwner = new groundOwnerModel_1.default(data);
        yield newGroundOwner.save();
        return newGroundOwner;
    }
    catch (error) {
        throw new Error("Failed to register ground owner");
    }
});
exports.createGroundOwner = createGroundOwner;
const getGroundOwners = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groundOwners = yield groundOwnerModel_1.default.find();
        return groundOwners;
    }
    catch (error) {
        throw new Error("Failed to fetch ground owners");
    }
});
exports.getGroundOwners = getGroundOwners;
