import AuthUtils from "../utils/authUtils.mjs";
import { logger } from "../../../middleware/logger.mjs";

const auth = new AuthUtils();

const facebookLoginController = async (req, res) => {
  try {
    const user = req.user;
    if (!user)
      return res.redirect(
        `${
          process.env.FRONTEND_URL || "http://localhost:8080"
        }/login?error=Authentication%20Failed`
      );

    const tokens = await auth.generateTokens(user);

    res.cookie("refresh-token", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("access-token", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("x-csrf-token", tokens.csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.header("x-csrf-token", tokens.csrfToken);

    return res.status(200).json({ message: "Login Successful" });
  } catch (error) {
    logger.error("Facebook Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default facebookLoginController;
