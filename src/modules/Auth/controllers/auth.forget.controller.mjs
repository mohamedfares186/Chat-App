import ForgetPasswordService from "../services/auth.forget.service.mjs";
import { logger } from "../../../middleware/logger.mjs";

const forgetPasswordService = new ForgetPasswordService();

const forgetPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await forgetPasswordService.sendResetPasswordLink(email);

    return res.status(200).json({
      message: "Check your email for the reset link!",
    });
  } catch (error) {
    logger.error(`Forget password error: ${error.message}`);

    // Generic error message
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default forgetPasswordController;
