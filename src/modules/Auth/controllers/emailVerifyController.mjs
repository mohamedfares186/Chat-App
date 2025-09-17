import EmailVerificationService from "../services/emailVerifyService.mjs";
import { logger } from "../../../middleware/logger.mjs";

const emailVerificationService = new EmailVerificationService();

const emailVerifyController = async (req, res) => {
  try {
    const user = req.user;
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    await emailVerificationService.validateToken(user, token);
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    logger.error(`Error verifying email: ${error}`);

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

export default emailVerifyController;
