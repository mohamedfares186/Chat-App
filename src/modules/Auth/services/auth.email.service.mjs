import AuthUtils from "../utils/auth.util.mjs";
import userRepositoryImpl from "../../Users/repositories/implementation/users.implementation.repository.mjs";
import { validateEmailVerificationToken } from "../../../utils/validateToken.mjs";

class EmailVerificationService {
  constructor(users = new userRepositoryImpl(), utils = new AuthUtils()) {
    this.users = users;
    this.utils = utils;
  }

  async verifyEmail(userId, token) {
    // Find user by ID
    const user = await this.users.findById(userId);
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    // Check if already verified
    if (user.isVerified) {
      throw new Error("Email is already verified");
    }

    // Validate token
    const isValid = validateEmailVerificationToken(userId, token);
    if (!isValid) {
      throw new Error("Invalid or expired verification token");
    }

    // Update user verification status
    const updatedUser = await this.users.update({
      ...user,
      isVerified: true,
    });

    return updatedUser;
  }

  async resendVerificationEmail(userId) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isEmailVerified) {
      throw new Error("Email is already verified");
    }

    // Send verification email using AuthUtils
    const result = await this.utils.sendVerifyEmail(user);
    return result;
  }
}

export default EmailVerificationService;
