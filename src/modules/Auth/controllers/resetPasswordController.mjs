import ResetPasswordService from "../services/resetPasswordService.mjs";
import { logger } from "../../../middleware/logger.mjs";
import { validateResetPasswordToken } from "../../../utils/validateToken.mjs";

const resetPasswordService = new ResetPasswordService();

const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, repeatPassword } = req.body;

    // Validate token and get userId
    const userId = validateResetPasswordToken(token);
    if (!userId) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Reset password using service
    await resetPasswordService.resetPassword(userId, {
      newPassword,
      repeatPassword,
    });

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    logger.error(`Reset password error: ${error}`);

    // Return specific errors
    if (
      error.message.includes("required") ||
      error.message.includes("match") ||
      error.message.includes("characters") ||
      error.message.includes("Invalid")
    ) {
      return res.status(400).json({ error: error.message });
    }

    // Generic error
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default resetPasswordController;
