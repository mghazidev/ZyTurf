import { z } from "zod";

export const formSchema = z.object({
  fullname: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email format"),
  contactNo: z.string().min(1, "Contact Number is required"),
  groundLocation: z.string().min(1, "Ground Location is required"),
  paymentMethod: z.string().min(1, "Payment Method is required"),
  cnicFrontUrl: z.instanceof(File, { message: "Cnic Front is required" }),
  cnicBackUrl: z.instanceof(File, { message: "Cnic Back is required" }),
});

export type FormData = z.infer<typeof formSchema>;
