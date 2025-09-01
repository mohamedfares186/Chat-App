import crypto from "crypto";
import envConfig from "../config/environment.mjs";

// Generate csrf tokens
const generateCsrfToken = (userId) => {
  const random = crypto.randomBytes(32).toString("hex");
  const timeStamp = Date.now();
  const hmac = crypto
    .createHmac("sha256", envConfig.csrfTokenSecret)
    .update(`${userId}.${random}.${timeStamp}`)
    .digest("hex");

  return `${random}.${timeStamp}.${hmac}`;
};

// verify csrf token
const verifyCsrfToken = (userId, token) => {
  try {
    // Validate token format
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      return false;
    }

    const [random, timeStamp, hmac] = tokenParts;

    // Validate token expiration
    if (Date.now() - parseInt(timeStamp) > envConfig.csrfExpire) {
      return false;
    }

    // Validate token HMAC
    const hmacToVerify = crypto
      .createHmac("sha256", envConfig.csrfTokenSecret)
      .update(`${userId}.${random}.${timeStamp}`)
      .digest("hex");

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(hmacToVerify));
  } catch (error) {
    console.error("CSRF token verification error:", error);
    return false;
  }
};

const validateCsrfToken = (req, res, next) => {
  try {
    const token = req.headers["x-csrf-token"];
    const cookieToken = req.cookies["x-csrf-token"];
    const userId = req.user?.userId;

    // Check if all required components are present
    if (!token || !cookieToken) {
      console.warn(
        `CSRF validation failed - Missing tokens. IP: ${req.ip}, User: ${
          userId || "unknown"
        }`
      );
      return res.status(403).json({ Error: "CSRF token is required" });
    }

    if (!userId) {
      console.warn(`CSRF validation failed - No userId. IP: ${req.ip}`);
      return res.status(403).json({ Error: "Forbidden" });
    }

    // Verify that header token matches cookie token
    if (token !== cookieToken) {
      console.warn(
        `CSRF validation failed - Token mismatch. IP: ${req.ip}, User: ${userId}`
      );
      return res.status(403).json({ Error: "Invalid CSRF token" });
    }

    // Verify token authenticity
    if (!verifyCsrfToken(userId, token)) {
      console.warn(
        `CSRF validation failed - Invalid token. IP: ${req.ip}, User: ${userId}`
      );
      return res.status(403).json({ Error: "Invalid CSRF token" });
    }

    // Generate and set new rotated token
    const rotateToken = generateCsrfToken(userId);
    res.cookie("x-csrf-token", rotateToken, {
      httpOnly: true,
      secure: envConfig.nodeEnv === "production",
      sameSite: "strict",
      maxAge: parseInt(envConfig.csrfExpire),
    });
    res.setHeader("x-csrf-token", rotateToken);

    return next();
  } catch (error) {
    console.error("CSRF middleware error:", error);
    return res.status(500).json({ Error: "Internal server error" });
  }
};

export { generateCsrfToken, validateCsrfToken };
