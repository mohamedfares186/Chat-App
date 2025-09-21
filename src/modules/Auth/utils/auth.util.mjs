import { generateCsrfToken } from "../../../middleware/csrf.mjs";
import {
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  generateResetPasswordToken,
} from "../../../utils/generateToken.mjs";
import sendEmail from "../../../utils/sendEmail.mjs";
import env from "../../../config/environment.mjs";
import PermissionService from "../../../services/permissionServices.mjs";
import bcrypt from "bcryptjs";
import { logger } from "../../../middleware/logger.mjs";

class AuthUtils {
  constructor() {
    this.generateCsrfToken = generateCsrfToken;
    this.generateAccessToken = generateAccessToken;
    this.generateRefreshToken = generateRefreshToken;
    this.generateEmailVerificationToken = generateEmailVerificationToken;
    this.generateResetPasswordToken = generateResetPasswordToken;
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
    const { newPassword, repeatPassword } = resetData;

    if (!newPassword?.trim()) errors.push("Password is required");
    if (!repeatPassword?.trim())
      errors.push("Password confirmation is required");

    if (newPassword && !this.isValidPassword(newPassword)) {
      errors.push(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      );
    }

    if (newPassword && repeatPassword && newPassword !== repeatPassword) {
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
    let age = today.getFullYear() - birthDate.getFullYear();
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
      const resetLink = `${env.frontendUrl}:${env.port}/api/auth/reset-password/${token}`;

      const result = await sendEmail(
        user.email,
        "Reset Your Password",
        `Click the following link to reset your password: ${resetLink}`
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
      const verifyLink = `${env.frontendUrl}:${env.port}/api/auth/verify-email/${token}`;

      const result = await sendEmail(
        user.email,
        "Verify Your Email Address",
        `Click the following link to verify your email: ${verifyLink}`
      );

      logger.info(`Verification email sent to: ${user}`);
      return { token, result };
    } catch (error) {
      logger.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }

  // ==================== TOKEN UTILITIES ====================

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
