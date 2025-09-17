import { z } from "zod";
import validator from "validator";

/**
 * Forgot password validation schema
 */
export const forgetPasswordValidationSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .max(254, "Email is too long")
    .email("Invalid email format")
    .refine(
      (email) => validator.isEmail(email),
      "Invalid email format"
    )
    .refine(
      (email) => !email.includes("+"),
      "Email aliases are not allowed"
    ),
});

/**
 * Sanitize forgot password data
 */
export const sanitizeForgetPasswordData = (data) => {
  return {
    email: data.email?.toLowerCase().trim(),
  };
};
