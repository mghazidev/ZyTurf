import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateGroundOwner } from "@/modules/registration/hook/useGroundOwner";
import { formSchema } from "../form/formSchema";
import type { FormData } from "../form/formSchema";

export const useOnBoardForm = (recaptchaToken: string | null) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { mutate, isLoading, isError, error } = useCreateGroundOwner();

  const handleFileChange = (
    fieldName: keyof FormData,
    files: FileList | null
  ) => {
    if (files?.length) {
      setValue(fieldName, files[0], { shouldValidate: true });
    }
  };

  const onSubmit = (data: FormData) => {
    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA verification.");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", data.fullname);
    formData.append("email", data.email);
    formData.append("contactNo", data.contactNo);
    formData.append("groundLocation", data.groundLocation);
    formData.append("paymentMethod", data.paymentMethod);

    if (data.cnicFrontUrl) formData.append("cnicFrontUrl", data.cnicFrontUrl);
    if (data.cnicBackUrl) formData.append("cnicBackUrl", data.cnicBackUrl);

    mutate(formData);
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    handleFileChange,
    errors,
    isLoading,
    isError,
    error,
  };
};
