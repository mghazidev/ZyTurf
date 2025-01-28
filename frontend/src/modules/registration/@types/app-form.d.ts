import { z } from "zod";

const formSchema = z.object({
  fullname: z.string().min(1, "Full Name is required"),
  contactNo: z.string().min(1, "Contact Number is required"),
  groundLocation: z.string().min(1, "Ground Location is required"),
  paymentMethod: z.string().min(1, "Payment Method is required"),
  cnicFront: z.instanceof(File).optional(),
  cnicBack: z.instanceof(File).optional(),
});

export type FormData = z.infer<typeof formSchema>;

export namespace appModelTypes {
  // API Response structure
  export interface ApiResponseSuccess<T> {
    success: boolean;
    data: T;
  }

  // GroundOwner request structure
  export interface GroundOwnerRequest {
    fullname: string;
    contactNo: string;
    cnicFrontUrl: any;
    cnicBackUrl: any;
    groundLocation: string;
    paymentMethod: string;
  }

  // GroundOwner response structure
  export interface GroundOwner {
    _id: string;
    fullname: string;
    contactNo: string;
    cnicFrontUrl: string;
    cnicBackUrl: string;
    groundLocation: string;
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
  }
}
