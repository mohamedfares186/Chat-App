import LoginService from "../services/loginService.mjs";
import { logger } from "../../../middleware/logger.mjs";
import envConfig from "../../../config/environment.mjs";

const loginService = new LoginService();

const loginController = async (req, res) => {
  try {
    const user = req.body;
    const tokens = await loginService.login(user);

    res.cookie("access-token", tokens.accessToken, {
      httpOnly: true,
      secure: envConfig.nodeEnv === "production",
      sameSite: "strict",
      maxAge: parseInt(envConfig.accessTokenExpire),
    });
    res.cookie("refresh-token", tokens.refreshToken, {
      httpOnly: true,
      secure: envConfig.nodeEnv === "production",
      sameSite: "strict",
      maxAge: parseInt(envConfig.refreshTokenExpire),
    });
    res.cookie("x-csrf-token", tokens.csrfToken, {
      httpOnly: true,
      secure: envConfig.nodeEnv === "production",
      sameSite: "strict",
      maxAge: parseInt(envConfig.csrfTokenExpire),
    });
    res.setHeader("x-csrf-token", tokens.csrfToken);
    return res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    logger.error(`Error logging in: ${error}`);

    // Return specific errors
    if (
      error.message.includes("Invalid") ||
      error.message.includes("required") ||
      error.message.includes("characters")
    ) {
      return res.status(400).json({ error: error.message });
    }

    // Generic error
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default loginController;
