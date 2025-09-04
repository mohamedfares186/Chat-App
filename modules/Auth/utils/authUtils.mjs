import {
  generateAccessToken,
  generateRefreshToken,
  emailVerificationToken,
  validateEmailVerificationToken,
  validateResetPasswordToken,
} from "../../../utils/generateToken.mjs";
import { generateCsrfToken } from "../../../middleware/csrf.mjs";
import sendEmail from "../../../utils/sendEmail.mjs";
import envConfig from "../../../config/environment.mjs";

class AuthUtils {
  constructor() {
    this.emailVerificationToken = emailVerificationToken;
    this.generateAccessToken = generateAccessToken;
    this.generateRefreshToken = generateRefreshToken;
    this.generateCsrfToken = generateCsrfToken;
    this.validateEmailVerificationToken = validateEmailVerificationToken;
    this.validateResetPasswordToken = validateResetPasswordToken;
  }

  async generateTokens(user) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const csrfToken = generateCsrfToken(user);
    return { accessToken, refreshToken, csrfToken };
  }

  async sendVerifyEmail(user) {
    const email = user.email;
    const token = emailVerificationToken(user);
    const verifyLink = `${envConfig.frontendUrl || "http://localhost"}:${
      envConfig.port || 8080
    }/api/auth/verify-email/${token}`;
    await sendEmail(
      email,
      "Verify Your email",
      `Click the following link to verify your email: ${verifyLink}`
    );
    return token;
  }

  validateEmailToken(user, token) {
    const userId = user.userId;
    const validate = validateEmailVerificationToken(userId, token);
    return validate;
  }

  validateResetToken(token) {
    return validateResetPasswordToken(token);
  }
}

export default AuthUtils;
