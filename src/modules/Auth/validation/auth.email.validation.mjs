import { z } from "zod";

// Email verification validation schema
export const emailVerificationValidationSchema = z.object({
  emailVerificationToken: z.object({
    token: z.string().min(1, "Verification token is required"),
  }),
});

export const sanitizeEmailVerificationData = (data) => {
  return {
    emailVerificationToken: {
      token: data.emailVerificationToken?.token?.trim(),
    },
  };
};
