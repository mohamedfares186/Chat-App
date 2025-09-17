import { logger } from "../../../middleware/logger.mjs";
import AuthUtils from "../utils/authUtils.mjs";

const authUtils = new AuthUtils();

const generateVerificationToken = async (req, res) => {
  try {
    const user = req.user;

    if (user.isVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    await authUtils.sendVerifyEmail(user);
    return res.status(200).json({
      message: "Check your email to verify your account",
    });
  } catch (error) {
    logger.error(`Verification email token error: ${error}`);

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
