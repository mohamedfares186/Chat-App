import userRepositoryImpl from "../../Users/repositories/implementation/users.implementation.repository.mjs";
import AuthUtils from "../utils/auth.util.mjs";

class ForgetPasswordService {
  constructor() {
    this.users = new userRepositoryImpl();
    this.authUtils = new AuthUtils();
  }

  async sendResetPasswordLink(email) {
    // Validate email format
    if (!this.authUtils.isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    const user = await this.users.findByEmail(email.toLowerCase().trim());
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
