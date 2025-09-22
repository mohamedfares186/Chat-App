import jwt from "jsonwebtoken";
import env from "../../../config/environment.mjs";
import { generateAccessToken } from "../../../utils/generateToken.mjs";

class RefreshService {
  verifyRefreshToken(token) {
    const decoded = jwt.verify(token, env.refreshTokenSecret);
    const accessToken = generateAccessToken(decoded);
    return accessToken;
  }
}

export default RefreshService;
