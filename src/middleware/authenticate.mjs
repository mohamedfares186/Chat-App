import { logger } from "./logger.mjs";
import { validateAccessToken } from "../utils/tokenValidation.mjs";

const extractTokenFromRequest = (req) => {
  // Priority: Authorization header Bearer -> Cookie
  const authHeader = req.headers && req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }
  if (req.cookies && req.cookies["access-token"]) {
    return req.cookies["access-token"];
  }
  return null;
};

const authenticate = (req, res, next) => {
  try {
    const token = extractTokenFromRequest(req);
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = validateAccessToken(token);

    const user = {
      userId: decoded.userId,
      role: decoded.role,
      permissions: decoded.permissions || undefined,
    };

    req.user = user;
    return next();
  } catch (error) {
    logger.warn(`Authentication Error: ${error}`);
    return res.status(500).json({ error: "Authentication error" });
  }
};

export default authenticate;
