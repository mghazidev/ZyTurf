import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
export interface IGroundOwner extends Document {
  fullname: string;
  contactNo: string;
  email: string;
  cnicFrontUrl: string;
  cnicBackUrl: string;
  groundLocation: string;
  paymentMethod: string;
  password: string;
  userId: mongoose.Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const groundOwnerSchema: Schema = new Schema(
  {
    fullname: { type: String, required: true },
    contactNo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    cnicFrontUrl: { type: String, required: true },
    cnicBackUrl: { type: String, required: true },
    groundLocation: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    password: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

groundOwnerSchema.pre<IGroundOwner>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
groundOwnerSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const GroundOwner = mongoose.model<IGroundOwner>(
  "GroundOwner",
  groundOwnerSchema
);

export default GroundOwner;
