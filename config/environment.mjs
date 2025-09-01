import { config } from "dotenv";
import fs from "fs";
import { logger } from "../middleware/logger.mjs";

// Determine environment
const nodeEnv = process.env.NODE_ENV || "development";
const envFile = `.env.${nodeEnv}`;

// Load the appropriate .env file if it exists
if (fs.existsSync(envFile)) {
  config({ path: envFile });
  logger.info(`Loaded environment: ${nodeEnv}`);
} else {
  config(); // fallback to .env
  logger.warn(`Warning: ${envFile} not found, using .env`);
}

// Environment variables configuration
const envConfig = {
  nodeEnv,
  port: process.env.PORT || 8080,
  databaseUrl: process.env.DATABASE_URL,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  emailVerificationTokenSecret: process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
  resetPasswordTokenSecret: process.env.RESET_PASSWORD_TOKEN_SECRET,
  csrfTokenSecret: process.env.CSRF_TOKEN_SECRET,
  csrfExpire: process.env.CSRF_TOKEN_EXPIRE || 3600000, // Default 1 hour
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
};

export default envConfig;
