import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import groundOwnerEndpoint from "./endpoints/groundOwnerEndpoint";
import cors from "cors";
import authEndpoint from "./endpoints/authEndpoint";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/v1", groundOwnerEndpoint);
app.use("/api/v1", authEndpoint);
mongoose
  .connect("mongodb://localhost:27017/zyturf", {})
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));
