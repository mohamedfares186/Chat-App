import { z } from "zod";

// Reset password validation schema
export const resetPasswordValidationSchema = z
  .object({
    resetPasswordToken: z.object({
      token: z.string().min(1, "Reset token is required"),
    }),
    newPassword: z.string().min(8, "New password is required"),
    repeatPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

// Sanitize reset password data
export const sanitizeResetPasswordData = (data) => {
  return {
    resetPasswordToken: {
      token: data.resetPasswordToken?.token?.trim(),
    },
    newPassword: data.newPassword?.trim(),
    repeatPassword: data.repeatPassword?.trim(),
  };
};
