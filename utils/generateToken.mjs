import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";
import envConfig from "../config/environment.mjs";

const generateRefreshToken = (user) => {
  const token = jsonwebtoken.sign(
    { userId: user.userId, username: user.username, role: user.role },
    envConfig.refreshTokenSecret,
    { expiresIn: "7d" }
  );
  return token;
};

const generateAccessToken = (user) => {
  const token = jsonwebtoken.sign(
    { userId: user.userId, username: user.username, role: user.role },
    envConfig.accessTokenSecret,
    { expiresIn: "15m" }
  );
  return token;
};

const emailVerificationToken = (userId) => {
  const random = crypto.randomBytes(32).toString("hex");
  const timeStamp = Date.now();
  const hmac = crypto
    .createHmac("sha256", envConfig.emailVerificationTokenSecret)
    .update(`${userId}.${random}.${timeStamp}`)
    .digest("hex");

  return `${random}.${timeStamp}.${hmac}`;
};

const resetPasswordToken = (userId) => {
  const random = crypto.randomBytes(32).toString("hex");
  const timeStamp = Date.now();
  const hmac = crypto
    .createHmac("sha256", envConfig.resetPasswordTokenSecret)
    .update(`${userId}.${random}.${timeStamp}`)
    .digest("hex");

  return `${random}.${userId}.${timeStamp}.${hmac}`;
};

// Validate tokens
const validateEmailVerificationToken = (userId, token) => {
  const [random, timeStamp, hmac] = token.split(".");
  const now = Date.now();

  // Check if token is expired
  if (now - timeStamp > 3600000) return false;

  // Validate HMAC
  const validHmac = crypto
    .createHmac("sha256", envConfig.emailVerificationTokenSecret)
    .update(`${userId}.${random}.${timeStamp}`)
    .digest("hex");

  return hmac === validHmac;
};

const validateResetPasswordToken = (token) => {
  const [random, userId, timeStamp, hmac] = token.split(".");
  const now = Date.now();

  // Check if token is expired
  if (now - timeStamp > 3600000) return false;

  // Validate HMAC
  const validHmac = crypto
    .createHmac("sha256", envConfig.resetPasswordTokenSecret)
    .update(`${userId}.${random}.${timeStamp}`)
    .digest("hex");

  if (validHmac !== hmac) return false;

  return userId;
};

export {
  generateRefreshToken,
  generateAccessToken,
  emailVerificationToken,
  resetPasswordToken,
  validateEmailVerificationToken,
  validateResetPasswordToken,
};
