import AuthUtils from "../utils/authUtils.mjs";
import userRepositoryImpl from "../repositories/implementation/userRepositoryImpl.mjs";

class EmailVerificationService {
  constructor() {
    this.userRepo = new userRepositoryImpl();
    this.authUtils = new AuthUtils();
  }

  async verifyEmail(userId, token) {
    // Find user by ID
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if already verified
    if (user.isEmailVerified) {
      throw new Error("Email is already verified");
    }

    // Validate token using AuthUtils
    const isValid = this.authUtils.validateEmailToken(user, token);
    if (!isValid) {
      throw new Error("Invalid or expired verification token");
    }

    // Update user verification status
    const updatedUser = await this.userRepo.update({
      ...user,
      isEmailVerified: true,
    });

    return updatedUser;
  }

  async resendVerificationEmail(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isEmailVerified) {
      throw new Error("Email is already verified");
    }

    // Send verification email using AuthUtils
    const result = await this.authUtils.sendVerifyEmail(user);
    return result;
  }
}

export default EmailVerificationService;
