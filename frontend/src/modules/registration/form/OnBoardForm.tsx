"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateGroundOwner } from "@/modules/registration/hook/useGroundOwner";
import { formSchema } from "./formSchema";
import type { FormData } from "./formSchema";
import { appModelTypes } from "../@types/app-form";

const OnBoardForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleFileChange = (
    fieldName: keyof FormData,
    files: FileList | null
  ) => {
    if (files?.length) {
      setValue(fieldName, files[0], { shouldValidate: true });
    }
  };

  const { mutate, isLoading, isError, error } = useCreateGroundOwner();

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append("fullname", data.fullname);
    formData.append("contactNo", data.contactNo);
    formData.append("groundLocation", data.groundLocation);
    formData.append("paymentMethod", data.paymentMethod);

    if (data.cnicFrontUrl) {
      formData.append("cnicFrontUrl", data.cnicFrontUrl);
    }
    if (data.cnicBackUrl) {
      formData.append("cnicBackUrl", data.cnicBackUrl);
    }

    console.log(formData);

    mutate(formData);
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
          onChange={(e) => handleFileChange("cnicFrontUrl", e.target.files)}
        />
        {errors.cnicFrontUrl && <p>{errors.cnicFrontUrl.message}</p>}

        <label>CNIC Back Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange("cnicBackUrl", e.target.files)}
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
