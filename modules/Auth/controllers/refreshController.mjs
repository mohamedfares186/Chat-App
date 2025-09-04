import RefreshService from "../services/refreshService.mjs";
import { logger } from "../../../middleware/logger.mjs";
import envConfig from "../../../config/environment.mjs";

const refreshService = new RefreshService();

const refreshController = async (req, res) => {
  try {
    const cookies = req.cookies["refresh-token"];
    if (!cookies) return res.status(401).json({ error: "Unauthorized" });

    const accessToken = refreshService.verifyRefreshToken(cookies);
    res.cookie("access-token", accessToken, {
      httpOnly: true,
      secure: envConfig.nodeEnv === "production",
      sameSite: "Strict",
      maxAge: parseInt(envConfig.accessTokenExpire),
    });
    return res.sendStatus(200);
  } catch (error) {
    logger.error(`Error refreshing token: ${error}`);

    // Return specific errors
    if (error.message.includes("Invalid")) {
      return res.status(400).json({ error: error.message });
    }

    // Generic error
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default refreshController;
