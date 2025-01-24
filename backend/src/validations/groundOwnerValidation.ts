import Joi from "joi";

export const groundOwnerValidationSchema = Joi.object({
  fullname: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Fullname is required",
    "string.min": "Fullname must be at least 3 characters",
    "string.max": "Fullname must not exceed 50 characters",
  }),
  contactNo: Joi.string()
    .pattern(/^[0-9]{10,12}$/)
    .required()
    .messages({
      "string.pattern.base": "Contact number must be between 10-12 digits",
    }),
  groundLocation: Joi.string().required().messages({
    "string.empty": "Ground location is required",
  }),
  paymentMethod: Joi.string()
    .valid("Cash", "Card", "Online")
    .required()
    .messages({
      "any.only": "Payment method must be 'Cash', 'Card', or 'Online'",
    }),
  cnicFrontUrl: Joi.string().required().messages({
    "string.empty": "CNIC front image is required",
  }),
  cnicBackUrl: Joi.string().required().messages({
    "string.empty": "CNIC back image is required",
  }),
});
