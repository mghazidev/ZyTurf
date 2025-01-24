import mongoose, { Schema, Document } from "mongoose";

export interface IGroundOwner extends Document {
  fullname: string;
  contactNo: string;
  cnicFrontUrl: string;
  cnicBackUrl: string;
  groundLocation: string;
  paymentMethod: string;
}

const groundOwnerSchema: Schema = new Schema(
  {
    fullname: { type: String, required: true },
    contactNo: { type: String, required: true },
    cnicFrontUrl: { type: String, required: true },
    cnicBackUrl: { type: String, required: true },
    groundLocation: { type: String, required: true },
    paymentMethod: { type: String, required: true },
  },
  { timestamps: true }
);

const GroundOwner = mongoose.model<IGroundOwner>(
  "GroundOwner",
  groundOwnerSchema
);

export default GroundOwner;
