import userRepositoryImpl from "../repositories/implementation/userRepositoryImpl.mjs";
import AuthUtils from "../utils/authUtils.mjs";

class ResetPasswordService {
  constructor() {
    this.userRepo = new userRepositoryImpl();
    this.authUtils = new AuthUtils();
  }

  async resetPassword(token, passwordData) {
    // Validate password data using AuthUtils
    this.authUtils.validatePasswordResetData(passwordData);

    // Validate reset token and get user ID
    const userId = this.authUtils.validateResetToken(token);
    if (!userId) {
      throw new Error("Invalid or expired reset token");
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if account is active
    if (!this.authUtils.isAccountActive(user)) {
      throw new Error("Account is locked or suspended");
    }

    const { password } = passwordData;

    // Check if new password is different from current password
    const isSamePassword = await this.authUtils.comparePassword(
      password,
      user.password
    );
    if (isSamePassword) {
      throw new Error("New password must be different from current password");
    }

    // Hash new password using AuthUtils
    const hashedPassword = await this.authUtils.hashPassword(password);

    // Update user password
    const updatedUser = await this.userRepo.update({
      ...user,
      password: hashedPassword,
    });

    return updatedUser;
  }
}

export default ResetPasswordService;
