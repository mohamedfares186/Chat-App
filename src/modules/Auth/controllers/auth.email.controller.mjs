import EmailVerificationService from "../services/auth.email.service.mjs";
import { logger } from "../../../middleware/logger.mjs";

const emailVerificationService = new EmailVerificationService();

const emailVerifyController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    await emailVerificationService.verifyEmail(userId, token);
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    logger.error("Error verifying email: ", error.message);

    // Return specific errors
    if (
      error.message === "Invalid Credentials" ||
      error.message === "Email is already verified" ||
      error.message === "Invalid or expired token"
    ) {
      return res.status(400).json({ error: error.message });
    }

    // Generic error
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default emailVerifyController;
