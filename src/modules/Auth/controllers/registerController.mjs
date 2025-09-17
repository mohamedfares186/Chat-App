import RegisterUserService from "../services/registerService.mjs";
import { logger } from "../../../middleware/logger.mjs";
import env from "../../../config/environment.mjs";

const registerUserService = new RegisterUserService();

const registerController = async (req, res) => {
  try {
    const user = req.body;
    const tokens = await registerUserService.register(user);

    res.cookie("access-token", tokens.accessToken, {
      httpOnly: true,
      secure: env.env === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    });
    res.cookie("refresh-token", tokens.refreshToken, {
      httpOnly: true,
      secure: env.env === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });
    res.cookie("x-csrf-token", tokens.csrfToken, {
      httpOnly: true,
      secure: env.env === "production",
      sameSite: "strict",
      maxAge: parseInt(env.csrfTokenExpire),
    });
    res.setHeader("x-csrf-token", tokens.csrfToken);

    return res.status(201).json({
      message:
        "User registered successfully. Check your email to verify your account.",
    });
  } catch (error) {
    logger.error(`Error registering user: ${error}`);

    // Return specific errors
    if (
      error.message.includes("required") ||
      error.message.includes("match") ||
      error.message.includes("characters")
    ) {
      return res.status(400).json({ error: error.message });
    }

    // Generic error
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default registerController;
