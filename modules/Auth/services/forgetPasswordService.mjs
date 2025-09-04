import PrismaUserRepository from "../repositories/implementation/prismaUserRepository.mjs";
import { resetPasswordToken } from "../../../utils/generateToken.mjs";
import envConfig from "../../../config/environment.mjs";
import sendEmail from "../../../utils/sendEmail.mjs";

class ForgetPasswordService {
  constructor() {
    this.userRepo = new PrismaUserRepository();
  }

  async checkUser(email) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async sendResetPasswordLink(email) {
    const user = await this.checkUser(email);
    const token = resetPasswordToken(user);

    // Use proper URL construction
    const resetLink = `${envConfig.frontendUrl || "http://localhost"}:${
      envConfig.port || 8080
    }/api/auth/reset-password/${token}`;

    await sendEmail(
      user.email,
      "Reset Your Password",
      `Click the following link to reset your password: ${resetLink}`
    );

    return true;
  }
}

export default ForgetPasswordService;
