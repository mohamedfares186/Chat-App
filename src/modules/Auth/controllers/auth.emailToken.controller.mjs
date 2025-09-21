import { logger } from "../../../middleware/logger.mjs";
import EmailVerificationService from "../services/auth.email.service.mjs";

const emailVerificationService = new EmailVerificationService();

const generateVerificationToken = async (req, res) => {
  try {
    const user = req.user;

    await emailVerificationService.resendVerificationEmail(user.userId);
    return res.status(200).json({
      message: "Check your email to verify your account",
    });
  } catch (error) {
    logger.error(`Verification email token error: ${error.message}`);

    // Return specific errors
    if (
      error.message === "Invalid Credentials" ||
      error.message === "Email is already verified" ||
      error.message === "Invalid or expired token"
    ) {
      return res.status(400).json({ error: error.message });
    }

    // Generic error
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default generateVerificationToken;
