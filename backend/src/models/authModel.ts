import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ["customer", "ground-owner"],
      default: "customer",
    },
    groundOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "GroundOwner" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
