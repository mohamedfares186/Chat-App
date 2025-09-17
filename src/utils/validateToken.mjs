import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";
import env from "../config/environment.mjs";

/**
 * Validate JWT Access Token
 */
export const validateAccessToken = (token) => {
  try {
    const decoded = jsonwebtoken.verify(token, env.accessTokenSecret);
    return decoded;
  } catch {
    return null;
  }
};

/**
 * Validate JWT Refresh Token
 */
export const validateRefreshToken = (token) => {
  try {
    const decoded = jsonwebtoken.verify(token, env.refreshTokenSecret);
    return decoded;
  } catch {
    return null;
  }
};

/**
 * Validate Secure Token (for email verification, password reset, etc.)
 * @param {string} token - Token to validate
 * @param {string} userId - User ID (optional, for email verification)
 * @param {string} secret - Secret key for HMAC
 * @param {number} expirationMs - Expiration time in milliseconds (default: 1 hour)
 * @param {boolean} includeUserId - Whether token includes userId (for password reset)
 * @returns {boolean|string} - true/false for validation, or userId for password reset
 */
export const validateSecureToken = (
  token,
  userId,
  secret,
  expirationMs = 3600000,
  includeUserId = false
) => {
  try {
    const tokenParts = token.split(".");

    if (includeUserId) {
      // Password reset token format: random.userId.timestamp.hmac
      if (tokenParts.length !== 4) return false;

      const [random, tokenUserId, timeStamp, hmac] = tokenParts;
      const now = Date.now();

      // Check if token is expired
      if (now - parseInt(timeStamp) > expirationMs) return false;

      // Validate HMAC
      const validHmac = crypto
        .createHmac("sha256", secret)
        .update(`${tokenUserId}.${random}.${timeStamp}`)
        .digest("hex");

      if (validHmac !== hmac) return false;

      return tokenUserId; // Return userId for password reset
    } else {
      // Email verification token format: random.timestamp.hmac
      if (tokenParts.length !== 3) return false;

      const [random, timeStamp, hmac] = tokenParts;
      const now = Date.now();

      // Check if token is expired
      if (now - parseInt(timeStamp) > expirationMs) return false;

      // Validate HMAC
      const validHmac = crypto
        .createHmac("sha256", secret)
        .update(`${userId}.${random}.${timeStamp}`)
        .digest("hex");

      return hmac === validHmac;
    }
  } catch {
    return false;
  }
};

/**
 * Validate Email Verification Token
 */
export const validateEmailVerificationToken = (userId, token) => {
  return validateSecureToken(
    token,
    userId,
    env.emailVerificationTokenSecret,
    3600000, // 1 hour
    false
  );
};

/**
 * Validate Password Reset Token
 */
export const validateResetPasswordToken = (token) => {
  return validateSecureToken(
    token,
    null, // userId not needed for password reset validation
    env.resetPasswordTokenSecret,
    3600000, // 1 hour
    true // includeUserId = true
  );
};
