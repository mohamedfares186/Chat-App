import AuthUtils from "../utils/authUtils.mjs";
import PrismaUserRepository from "../repositories/implementation/prismaUserRepository.mjs";

class EmailVerificationService {
  constructor() {
    this.userRepo = new PrismaUserRepository();
    this.authUtils = new AuthUtils();
  }

  async checkUser(user) {
    const userId = user.userId;
    const existingUser = await this.userRepo.findById(userId);
    if (!existingUser) {
      throw new Error("Invalid Credentials");
    }
    if (existingUser.isVerified) {
      throw new Error("Email is already verified");
    }
    return existingUser;
  }

  async validateToken(user, token) {
    const validateUser = await this.checkUser(user);
    const isValid = this.authUtils.validateEmailToken(validateUser, token);

    if (!isValid) {
      throw new Error("Invalid or expired token");
    }

    // Update user verification status
    const updatedUser = await this.userRepo.update({
      ...validateUser,
      isVerified: true,
    });

    return updatedUser;
  }
}

export default EmailVerificationService;
