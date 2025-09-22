import userRepositoryImpl from "../../Users/repositories/implementation/users.implementation.repository.mjs";
import AuthUtils from "../utils/auth.util.mjs";

class ForgetPasswordService {
  constructor(users = new userRepositoryImpl(), utils = new AuthUtils()) {
    this.users = users;
    this.utils = utils;
  }

  async sendResetPasswordLink(email) {
    // Validate email format
    if (!this.utils.isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    const user = await this.users.findByEmail(email.toLowerCase().trim());
    if (!user) {
      throw new Error("User not found");
    }

    // Check if account is active
    if (!this.utils.isAccountActive(user)) {
      throw new Error("Account is locked or suspended");
    }

    // Send password reset email using AuthUtils
    const result = await this.utils.sendPasswordResetEmail(user);
    return result;
  }
}

export default ForgetPasswordService;
