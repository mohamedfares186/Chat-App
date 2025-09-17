import { z } from "zod";
import validator from "validator";

/**
 * Login validation schema with security checks
 */
export const loginValidationSchema = z.object({
  username: z.string()
    .min(1, "Username or email is required")
    .max(254, "Username or email is too long")
    .refine(
      (input) => {
        // Allow either username or email format
        const isEmail = validator.isEmail(input);
        const isUsername = /^[a-zA-Z0-9_]{3,20}$/.test(input);
        return isEmail || isUsername;
      },
      "Invalid username or email format"
    ),

  password: z.string()
    .min(1, "Password is required")
    .max(128, "Password is too long")
    .refine(
      (password) => password.length >= 8,
      "Password must be at least 8 characters"
    ),

  // Optional fields
  rememberMe: z.boolean().optional(),
  captcha: z.string().optional(),
});

/**
 * Sanitize login data
 */
export const sanitizeLoginData = (data) => {
  return {
    username: data.username?.toLowerCase().trim(),
    password: data.password?.trim(),
    rememberMe: Boolean(data.rememberMe),
    captcha: data.captcha?.trim(),
  };
};
