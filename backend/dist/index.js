"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const groundOwnerEndpoint_1 = __importDefault(require("./endpoints/groundOwnerEndpoint"));
const cors_1 = __importDefault(require("cors"));
const authEndpoint_1 = __importDefault(require("./endpoints/authEndpoint"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.use("/api/v1", groundOwnerEndpoint_1.default);
app.use("/api/v1", authEndpoint_1.default);
mongoose_1.default
    .connect("mongodb://localhost:27017/zyturf", {})
    .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch((err) => console.error("Failed to connect to MongoDB", err));
