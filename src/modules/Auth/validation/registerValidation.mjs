import { z } from "zod";
import validator from "validator";
import dayjs from "dayjs";

/**
 * Registration validation schema with comprehensive security checks
 */
export const registerValidationSchema = z.object({
  displayName: z.string()
    .min(1, "Display name is required")
    .max(50, "Display name must be 50 characters or less")
    .regex(/^[a-zA-Z0-9\s\-_.]+$/, "Display name contains invalid characters")
    .refine(
      (name) => !/^\s|\s$/.test(name),
      "Display name cannot start or end with whitespace"
    )
    .refine(
      (name) => !/\s{2,}/.test(name),
      "Display name cannot contain multiple consecutive spaces"
    ),

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
    )
    .refine(
      (email) => {
        const domain = email.split("@")[1];
        return !["tempmail.org", "10minutemail.com", "guerrillamail.com"].includes(domain);
      },
      "Temporary email services are not allowed"
    ),

  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be 20 characters or less")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .refine(
      (username) => !username.startsWith("_") && !username.endsWith("_"),
      "Username cannot start or end with underscore"
    )
    .refine(
      (username) => !/_{2,}/.test(username),
      "Username cannot contain consecutive underscores"
    ),

  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be 128 characters or less")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number")
    .refine(
      (password) => !/(.)\1{2,}/.test(password),
      "Password cannot contain more than 2 consecutive identical characters"
    )
    .refine(
      (password) => {
        const commonPasswords = ["password", "123456", "qwerty", "abc123", "password123"];
        return !commonPasswords.some(common => password.toLowerCase().includes(common));
      },
      "Password contains common patterns"
    ),

  repeatPassword: z.string()
    .min(1, "Password confirmation is required"),

  dateOfBirth: z.string()
    .min(1, "Date of birth is required")
    .refine(
      (date) => dayjs(date).isValid(),
      "Invalid date format"
    )
    .refine(
      (date) => {
        const age = dayjs().diff(dayjs(date), "year");
        return age >= 13 && age <= 120;
      },
      "You must be between 13 and 120 years old"
    )
    .refine(
      (date) => {
        const birthDate = dayjs(date);
        const today = dayjs();
        return birthDate.isBefore(today);
      },
      "Date of birth cannot be in the future"
    ),

  // Optional fields with validation
  phone: z.string()
    .optional()
    .refine(
      (phone) => !phone || validator.isMobilePhone(phone),
      "Invalid phone number format"
    ),

  bio: z.string()
    .max(500, "Bio must be 500 characters or less")
    .optional(),

  website: z.string()
    .optional()
    .refine(
      (url) => !url || validator.isURL(url, { protocols: ["http", "https"] }),
      "Invalid website URL"
    ),
}).refine(
  (data) => data.password === data.repeatPassword,
  {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  }
);

/**
 * Sanitize registration data
 */
export const sanitizeRegisterData = (data) => {
  return {
    displayName: data.displayName?.trim().replace(/[<>]/g, ""),
    email: data.email?.toLowerCase().trim(),
    username: data.username?.toLowerCase().trim(),
    password: data.password?.trim(),
    repeatPassword: data.repeatPassword?.trim(),
    dateOfBirth: data.dateOfBirth?.trim(),
    phone: data.phone?.replace(/[^\d+()-]/g, ""),
    bio: data.bio?.trim().substring(0, 500),
    website: data.website?.trim(),
  };
};
