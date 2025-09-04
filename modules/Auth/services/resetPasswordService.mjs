import PrismaUserRepository from "../repositories/implementation/prismaUserRepository.mjs";
import bcrypt from "bcryptjs";

class ResetPasswordService {
  constructor() {
    this.userRepo = new PrismaUserRepository();
  }

  validate(passwordData) {
    const { newPassword, repeatPassword } = passwordData;

    if (!newPassword || !repeatPassword) {
      throw new Error("Both password fields are required");
    }

    if (newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    if (newPassword !== repeatPassword) {
      throw new Error("Passwords do not match");
    }
  }

  async resetPassword(userId, passwordData) {
    this.validate(passwordData);

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const { newPassword } = passwordData;

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new Error("Invalid Credentials");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    const updatedUser = await this.userRepo.update({
      ...user,
      password: hashedPassword,
    });

    return updatedUser;
  }
}

export default ResetPasswordService;
