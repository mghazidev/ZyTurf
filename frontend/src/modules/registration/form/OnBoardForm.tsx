// "use client";
// import React from "react";
// import { useRecaptcha } from "@/modules/registration/hook/useRecaptcha";
// import { useOnBoardForm } from "@/modules/registration/hook/useOnBoardForm";

// const OnBoardForm = () => {
//   const { recaptchaToken, RECAPTCHA_SITE_KEY } = useRecaptcha();
//   const {
//     register,
//     handleSubmit,
//     onSubmit,
//     handleFileChange,
//     errors,
//     isLoading,
//     isError,
//     error,
//   } = useOnBoardForm(recaptchaToken);

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div className="flex flex-col">
//         <input type="text" {...register("fullname")} placeholder="Full Name" />
//         {errors.fullname && <p>{errors.fullname.message}</p>}

//         <input
//           type="text"
//           {...register("contactNo")}
//           placeholder="Contact Number"
//         />
//         {errors.contactNo && <p>{errors.contactNo.message}</p>}

//         <label>CNIC Front Image:</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => handleFileChange("cnicFrontUrl", e.target.files)}
//         />
//         {errors.cnicFrontUrl && <p>{errors.cnicFrontUrl.message}</p>}

//         <label>CNIC Back Image:</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => handleFileChange("cnicBackUrl", e.target.files)}
//         />
//         {errors.cnicBackUrl && <p>{errors.cnicBackUrl.message}</p>}

//         <input
//           type="text"
//           {...register("groundLocation")}
//           placeholder="Ground Location"
//         />
//         {errors.groundLocation && <p>{errors.groundLocation.message}</p>}

//         <input
//           type="text"
//           {...register("paymentMethod")}
//           placeholder="Payment Method"
//         />
//         {errors.paymentMethod && <p>{errors.paymentMethod.message}</p>}

//         {/* reCAPTCHA */}
//         <div
//           className="g-recaptcha"
//           data-sitekey={RECAPTCHA_SITE_KEY}
//           data-callback="onRecaptchaSuccess"
//         ></div>

//         <button type="submit" disabled={isLoading}>
//           {isLoading ? "Submitting..." : "Submit"}
//         </button>

//         {isError && <p className="text-red-500">{(error as Error).message}</p>}
//       </div>
//     </form>
//   );
// };

// export default OnBoardForm;
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-5">
      <h2 className="text-2xl font-bold text-center text-white">
        Onboarding Form
      </h2>

      <div className="flex flex-col space-y-3">
        <input
          type="text"
          {...register("fullname")}
          placeholder="Full Name"
          className="p-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-green-400 text-white placeholder-gray-300"
        />
        {errors.fullname && (
          <p className="text-red-400">{errors.fullname.message}</p>
        )}

        <input
          type="text"
          {...register("contactNo")}
          placeholder="Contact Number"
          className="p-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-300"
        />
        {errors.contactNo && (
          <p className="text-red-400">{errors.contactNo.message}</p>
        )}

        <label className="text-sm text-white">CNIC Front Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange("cnicFrontUrl", e.target.files)}
          className="p-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300"
        />
        {errors.cnicFrontUrl && (
          <p className="text-red-400">{errors.cnicFrontUrl.message}</p>
        )}

        <label className="text-sm text-white">CNIC Back Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange("cnicBackUrl", e.target.files)}
          className="p-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300"
        />
        {errors.cnicBackUrl && (
          <p className="text-red-400">{errors.cnicBackUrl.message}</p>
        )}

        <input
          type="text"
          {...register("groundLocation")}
          placeholder="Ground Location"
          className="p-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-300"
        />
        {errors.groundLocation && (
          <p className="text-red-400">{errors.groundLocation.message}</p>
        )}

        <input
          type="text"
          {...register("paymentMethod")}
          placeholder="Payment Method"
          className="p-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-300"
        />
        {errors.paymentMethod && (
          <p className="text-red-400">{errors.paymentMethod.message}</p>
        )}
      </div>

      {/* reCAPTCHA */}
      <div className="g-recaptcha" data-sitekey={RECAPTCHA_SITE_KEY}></div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg hover:scale-105 transition"
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>

      {isError && (
        <p className="text-red-500 text-center">{(error as Error).message}</p>
      )}
    </form>
  );
};

export default OnBoardForm;
