import userRepositoryImpl from "../repositories/implementation/userRepositoryImpl.mjs";
import AuthUtils from "../utils/authUtils.mjs";

class ForgetPasswordService {
  constructor() {
    this.userRepo = new userRepositoryImpl();
    this.authUtils = new AuthUtils();
  }

  async sendResetPasswordLink(email) {
    // Validate email format
    if (!this.authUtils.isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    const user = await this.userRepo.findByEmail(email.toLowerCase().trim());
    if (!user) {
      throw new Error("User not found");
    }

    // Check if account is active
    if (!this.authUtils.isAccountActive(user)) {
      throw new Error("Account is locked or suspended");
    }

    // Send password reset email using AuthUtils
    const result = await this.authUtils.sendPasswordResetEmail(user);
    return result;
  }
}

export default ForgetPasswordService;
