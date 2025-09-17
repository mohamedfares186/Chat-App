import jsonwebtoken from "jsonwebtoken";
import env from "../../../config/environment.mjs";
import { generateAccessToken } from "../../../utils/generateToken.mjs";

class RefreshService {
  verifyRefreshToken(token) {
    try {
      const decoded = jsonwebtoken.verify(token, env.refreshTokenSecret);
      const accessToken = generateAccessToken(decoded);
      return accessToken;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}

export default RefreshService;
