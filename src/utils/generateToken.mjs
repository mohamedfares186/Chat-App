import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";
import env from "../config/environment.mjs";
import { logger } from "../middleware/logger.mjs";

/**
 * Generate JWT Access Token
 */
export const generateAccessToken = (user) => {
  try {
    const token = jsonwebtoken.sign(
      {
        userId: user.userId,
        role: user.role,
        permissions: user.permissions,
      },
      env.accessTokenSecret,
      { expiresIn: env.accessTokenExpire }
    );
    return token;
  } catch (error) {
    logger.error("Access token generation error:", error);
    throw new Error("Failed to generate access token");
  }
};

/**
 * Generate JWT Refresh Token
 */
export const generateRefreshToken = (user) => {
  try {
    const token = jsonwebtoken.sign(
      { userId: user.userId },
      env.refreshTokenSecret,
      { expiresIn: env.refreshTokenExpire }
    );
    return token;
  } catch (error) {
    logger.error("Refresh token generation error:", error);
    throw new Error("Failed to generate refresh token");
  }
};

/**
 * Generate Secure Token (for email verification, password reset, etc.)
 * @param {string} userId - User ID
 * @param {string} secret - Secret key for HMAC
 * @param {number} expirationMs - Expiration time in milliseconds (default: 1 hour)
 * @param {boolean} includeUserId - Whether to include userId in token (for password reset)
 * @returns {string} Generated token
 */
export const generateSecureToken = (
  userId,
  secret,
  expirationMs = 3600000,
  includeUserId = false
) => {
  try {
    const random = crypto.randomBytes(32).toString("hex");
    const timeStamp = Date.now();
    const hmac = crypto
      .createHmac("sha256", secret)
      .update(`${userId}.${random}.${timeStamp}`)
      .digest("hex");

    // For password reset, include userId in token for easy extraction
    if (includeUserId) {
      return `${random}.${userId}.${timeStamp}.${hmac}`;
    }

    return `${random}.${timeStamp}.${hmac}`;
  } catch (error) {
    logger.error("Secure token generation error:", error);
    throw new Error("Failed to generate secure token");
  }
};

/**
 * Generate Email Verification Token
 */
export const generateEmailVerificationToken = (user) => {
  return generateSecureToken(
    user.userId,
    env.emailVerificationTokenSecret,
    3600000, // 1 hour
    true
  );
};

/**
 * Generate Password Reset Token
 */
export const generateResetPasswordToken = (user) => {
  return generateSecureToken(
    user.userId,
    env.resetPasswordTokenSecret,
    3600000, // 1 hour
    true // Include userId for easy extraction
  );
};
