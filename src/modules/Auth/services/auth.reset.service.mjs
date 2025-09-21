import userRepositoryImpl from "../../Users/repositories/implementation/users.implementation.repository.mjs";
import AuthUtils from "../utils/auth.util.mjs";
import { validateResetPasswordToken } from "../../../utils/validateToken.mjs";

class ResetPasswordService {
  constructor() {
    this.users = new userRepositoryImpl();
    this.authUtils = new AuthUtils();
  }

  async resetPassword(token, passwordData) {
    // Validate password data using AuthUtils
    this.authUtils.validatePasswordResetData(passwordData);

    // Validate reset token and get user ID
    const userId = validateResetPasswordToken(token);

    if (!userId) {
      throw new Error("Invalid or expired reset token");
    }

    const user = await this.users.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if account is active
    if (!this.authUtils.isAccountActive(user)) {
      throw new Error("Account is locked or suspended");
    }

    const { newPassword } = passwordData;

    // Check if new password is different from current password
    const isSamePassword = await this.authUtils.comparePassword(
      newPassword,
      user.password
    );
    if (isSamePassword) {
      throw new Error("Invalid Credentials");
    }

    // Hash new password using AuthUtils
    const hashedPassword = await this.authUtils.hashPassword(newPassword);

    // Update user password
    const updatedUser = await this.users.update({
      ...user,
      password: hashedPassword,
    });

    return updatedUser;
  }
}

export default ResetPasswordService;
