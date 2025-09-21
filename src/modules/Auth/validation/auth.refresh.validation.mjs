import { z } from "zod";

/**
 * Refresh token validation schema
 */
export const refreshValidationSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

/**
 * Sanitize refresh token data
 */
export const sanitizeRefreshData = (data) => {
  return {
    refreshToken: data.refreshToken?.trim(),
  };
};
