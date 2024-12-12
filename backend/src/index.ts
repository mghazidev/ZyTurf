// src/index.ts
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import usersEndpoint from "./endpoints/users"; // Import the users endpoint

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Use the users endpoint for all /api/v1 users related routes
app.use("/api/v1", usersEndpoint);

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/zyturf", {})
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));
