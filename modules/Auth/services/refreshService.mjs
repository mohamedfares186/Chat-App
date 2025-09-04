import jsonwebtoken from "jsonwebtoken";
import envConfig from "../../../config/environment.mjs";
import { generateAccessToken } from "../../../utils/generateToken.mjs";

class RefreshService {
  verifyRefreshToken(token) {
    try {
      const decoded = jsonwebtoken.verify(token, envConfig.refreshTokenSecret);
      const accessToken = generateAccessToken(decoded);
      return accessToken;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}

export default RefreshService;
