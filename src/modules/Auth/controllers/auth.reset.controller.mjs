import ResetPasswordService from "../services/auth.reset.service.mjs";
import { logger } from "../../../middleware/logger.mjs";
const resetPasswordService = new ResetPasswordService();

const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, repeatPassword } = req.body;

    // Reset password using service
    await resetPasswordService.resetPassword(token, {
      newPassword,
      repeatPassword,
    });

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    logger.error(`Reset password error: ${error.message}`);

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
