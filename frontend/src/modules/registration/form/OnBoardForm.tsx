"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateGroundOwner } from "@/modules/registration/hook/useGroundOwner"; // Adjust the import path

const formSchema = z.object({
  fullname: z.string().min(1, "Full Name is required"),
  contactNo: z.string().min(1, "Contact Number is required"),
  groundLocation: z.string().min(1, "Ground Location is required"),
  paymentMethod: z.string().min(1, "Payment Method is required"),
  cnicFrontUrl: z.instanceof(File).optional(),
  cnicBackUrl: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof formSchema>;

const OnBoardForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { mutate, isLoading, isError, error } = useCreateGroundOwner();

  const onSubmit = (data: FormData) => {
    const requestData = {
      fullname: data.fullname,
      contactNo: data.contactNo,
      groundLocation: data.groundLocation,
      paymentMethod: data.paymentMethod,
      cnicFrontUrl: data.cnicFrontUrl,
      cnicBackUrl: data.cnicBackUrl,
    };

    mutate(requestData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <input type="text" {...register("fullname")} placeholder="Full Name" />
        {errors.fullname && <p>{errors.fullname.message}</p>}

        <input
          type="text"
          {...register("contactNo")}
          placeholder="Contact Number"
        />
        {errors.contactNo && <p>{errors.contactNo.message}</p>}

        <label>CNIC Front Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setValue("cnicFrontUrl", e.target.files?.[0])}
        />
        {errors.cnicFrontUrl && <p>{errors.cnicFrontUrl.message}</p>}

        <label>CNIC Back Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setValue("cnicBackUrl", e.target.files?.[0])}
        />
        {errors.cnicBackUrl && <p>{errors.cnicBackUrl.message}</p>}

        <input
          type="text"
          {...register("groundLocation")}
          placeholder="Ground Location"
        />
        {errors.groundLocation && <p>{errors.groundLocation.message}</p>}

        <input
          type="text"
          {...register("paymentMethod")}
          placeholder="Payment Method"
        />
        {errors.paymentMethod && <p>{errors.paymentMethod.message}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>

        {isError && <p className="text-red-500">{(error as Error).message}</p>}
      </div>
    </form>
  );
};

export default OnBoardForm;
