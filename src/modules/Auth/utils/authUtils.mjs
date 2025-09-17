import { generateCsrfToken } from "../../../middleware/csrf.mjs";
import {
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  generateResetPasswordToken,
} from "../../../utils/generateToken.mjs";
import {
  validateEmailVerificationToken,
  validateResetPasswordToken,
} from "../../../utils/validateToken.mjs";
import sendEmail from "../../../utils/sendEmail.mjs";
import env from "../../../config/environment.mjs";
import PermissionService from "../../../services/permissionServices.mjs";
import bcrypt from "bcryptjs";
import { logger } from "../../../middleware/logger.mjs";

class AuthUtils {
  constructor() {
    this.generateCsrfToken = generateCsrfToken;
  }

  // ==================== VALIDATION METHODS ====================

  /**
   * Validate user registration data
   */
  validateRegistrationData(userData) {
    const errors = [];
    const {
      displayName,
      email,
      username,
      password,
      repeatPassword,
      dateOfBirth,
    } = userData;

    // Required fields validation
    if (!displayName?.trim()) errors.push("Display name is required");
    if (!email?.trim()) errors.push("Email is required");
    if (!username?.trim()) errors.push("Username is required");
    if (!password?.trim()) errors.push("Password is required");
    if (!repeatPassword?.trim())
      errors.push("Password confirmation is required");
    if (!dateOfBirth) errors.push("Date of birth is required");

    // Email validation
    if (email && !this.isValidEmail(email)) {
      errors.push("Invalid email format");
    }

    // Username validation
    if (username && !this.isValidUsername(username)) {
      errors.push(
        "Username must be 3-20 characters long and contain only letters, numbers, and underscores"
      );
    }

    // Password validation
    if (password && !this.isValidPassword(password)) {
      errors.push(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      );
    }

    // Password confirmation
    if (password && repeatPassword && password !== repeatPassword) {
      errors.push("Passwords do not match");
    }

    // Date of birth validation
    if (dateOfBirth && !this.isValidDateOfBirth(dateOfBirth)) {
      errors.push("You must be at least 13 years old to register");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    return true;
  }

  /**
   * Validate login data
   */
  validateLoginData(loginData) {
    const errors = [];
    const { username, password } = loginData;

    if (!username?.trim()) errors.push("Username is required");
    if (!password?.trim()) errors.push("Password is required");

    if (password && password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    return true;
  }

  /**
   * Validate password reset data
   */
  validatePasswordResetData(resetData) {
    const errors = [];
    const { password, repeatPassword } = resetData;

    if (!password?.trim()) errors.push("Password is required");
    if (!repeatPassword?.trim())
      errors.push("Password confirmation is required");

    if (password && !this.isValidPassword(password)) {
      errors.push(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      );
    }

    if (password && repeatPassword && password !== repeatPassword) {
      errors.push("Passwords do not match");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    return true;
  }

  // ==================== HELPER VALIDATION METHODS ====================

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  isValidPassword(password) {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  isValidDateOfBirth(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1 >= 13;
    }
    return age >= 13;
  }

  // ==================== PASSWORD UTILITIES ====================

  /**
   * Hash password with bcrypt
   */
  async hashPassword(password) {
    try {
      const saltRounds = 12; // Increased from 10 for better security
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      logger.error("Error hashing password:", error);
      throw new Error("Password hashing failed");
    }
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password, hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      logger.error("Error comparing password:", error);
      throw new Error("Password comparison failed");
    }
  }

  // ==================== EMAIL UTILITIES ====================

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(user) {
    try {
      const token = this.generateResetPasswordToken(user);
      const resetLink = `${env.frontendUrl}/reset-password?token=${token}`;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.displayName || user.username},</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${resetLink}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
      `;

      const result = await sendEmail(
        user.email,
        "Reset Your Password",
        `Click the following link to reset your password: ${resetLink}`,
        htmlContent
      );

      logger.info(`Password reset email sent to ${user.email}`);
      return { token, result };
    } catch (error) {
      logger.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email");
    }
  }

  /**
   * Send email verification with improved template
   */
  async sendVerifyEmail(user) {
    try {
      const token = this.generateEmailVerificationToken(user);
      const verifyLink = `${env.frontendUrl}/verify-email?token=${token}`;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Chat App!</h2>
          <p>Hello ${user.displayName || user.username},</p>
          <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
          <a href="${verifyLink}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${verifyLink}</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `;

      const result = await sendEmail(
        user.email,
        "Verify Your Email Address",
        `Click the following link to verify your email: ${verifyLink}`,
        htmlContent
      );

      logger.info(`Verification email sent to ${user.email}`);
      return { token, result };
    } catch (error) {
      logger.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }

  // ==================== TOKEN UTILITIES ====================

  /**
   * Generate JWT Access Token
   */
  generateAccessToken(user) {
    try {
      return generateAccessToken(user);
    } catch (error) {
      logger.error("Error generating access token:", error);
      throw new Error("Failed to generate access token");
    }
  }

  /**
   * Generate JWT Refresh Token
   */
  generateRefreshToken(user) {
    try {
      return generateRefreshToken(user);
    } catch (error) {
      logger.error("Error generating refresh token:", error);
      throw new Error("Failed to generate refresh token");
    }
  }

  /**
   * Generate Email Verification Token
   */
  generateEmailVerificationToken(user) {
    try {
      return generateEmailVerificationToken(user);
    } catch (error) {
      logger.error("Error generating email verification token:", error);
      throw new Error("Failed to generate email verification token");
    }
  }

  /**
   * Generate Password Reset Token
   */
  generateResetPasswordToken(user) {
    try {
      return generateResetPasswordToken(user);
    } catch (error) {
      logger.error("Error generating reset password token:", error);
      throw new Error("Failed to generate reset password token");
    }
  }

  /**
   * Generate all tokens for a user (access, refresh, CSRF)
   */
  async generateTokens(user) {
    try {
      // Get user role and permissions from database
      const [userRole, userPermissions] = await Promise.all([
        PermissionService.getUserRole(user.userId),
        PermissionService.getUserPermissions(user.userId),
      ]);

      // Create user object with role and permissions for token generation
      const userWithPermissions = {
        ...user,
        role: userRole,
        permissions: userPermissions,
      };

      const accessToken = this.generateAccessToken(userWithPermissions);
      const refreshToken = this.generateRefreshToken(userWithPermissions);
      const csrfToken = this.generateCsrfToken(userWithPermissions);

      return { accessToken, refreshToken, csrfToken };
    } catch (error) {
      logger.error("Error generating tokens with permissions:", error);
      // Fallback to basic token generation if permission service fails
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);
      const csrfToken = this.generateCsrfToken(user);
      return { accessToken, refreshToken, csrfToken };
    }
  }

  /**
   * Validate email verification token
   */
  validateEmailToken(user, token) {
    try {
      const userId = user.userId;
      const isValid = validateEmailVerificationToken(userId, token);

      if (!isValid) {
        logger.warn(`Invalid email verification token for user ${userId}`);
      }

      return isValid;
    } catch (error) {
      logger.error("Error validating email token:", error);
      return false;
    }
  }

  /**
   * Validate password reset token and extract user ID
   */
  validateResetToken(token) {
    try {
      const userId = validateResetPasswordToken(token);

      if (!userId) {
        logger.warn("Invalid or expired password reset token");
      }

      return userId;
    } catch (error) {
      logger.error("Error validating reset token:", error);
      return null;
    }
  }

  // ==================== SECURITY UTILITIES ====================

  /**
   * Sanitize user input to prevent XSS
   */
  sanitizeInput(input) {
    if (typeof input !== "string") return input;

    return input
      .trim()
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .substring(0, 1000); // Limit length
  }

  /**
   * Generate secure random string
   */
  generateSecureRandom(length = 32) {
    const crypto = require("crypto");
    return crypto.randomBytes(length).toString("hex");
  }

  /**
   * Check if user account is locked or suspended
   */
  isAccountActive(user) {
    return user && !user.isLocked && !user.isSuspended;
  }
}

export default AuthUtils;
