import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import usersEndpoint from "./endpoints/users";
import groundOwnerEndpoint from "./endpoints/groundOwnerEndpoint";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*", // Replace "*" with your frontend URL if you want to restrict access
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

app.use(express.json());

app.use("/api/v1", usersEndpoint);
app.use("/api/v1", groundOwnerEndpoint);

mongoose
  .connect("mongodb://localhost:27017/zyturf", {})
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));
