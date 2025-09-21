import { z } from "zod";

/**
 * Logout validation schema
 */
export const logoutValidationSchema = z.object({
  refreshToken: z.string()
    .min(1, "Refresh token is required")
    .optional(),
  
  allDevices: z.boolean()
    .optional()
    .default(false),
});

/**
 * Sanitize logout data
 */
export const sanitizeLogoutData = (data) => {
  return {
    refreshToken: data.refreshToken?.trim(),
    allDevices: Boolean(data.allDevices),
  };
};
