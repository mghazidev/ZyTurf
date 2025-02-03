"use client";
import React from "react";
import { useRecaptcha } from "@/modules/registration/hook/useRecaptcha";
import { useOnBoardForm } from "@/modules/registration/hook/useOnBoardForm";

const OnBoardForm = () => {
  const { recaptchaToken, RECAPTCHA_SITE_KEY } = useRecaptcha();
  const {
    register,
    handleSubmit,
    onSubmit,
    handleFileChange,
    errors,
    isLoading,
    isError,
    error,
  } = useOnBoardForm(recaptchaToken);

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

        {/* reCAPTCHA */}
        <div
          className="g-recaptcha"
          data-sitekey={RECAPTCHA_SITE_KEY}
          data-callback="onRecaptchaSuccess"
        ></div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>

        {isError && <p className="text-red-500">{(error as Error).message}</p>}
      </div>
    </form>
  );
};

export default OnBoardForm;
