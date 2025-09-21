import rateLimit from "express-rate-limit";
import { logger } from "./logger.mjs";

// Custom error handler for rate limit exceeded
const rateLimitHandler = (req, res, next, options) => {
  const error = {
    status: "error",
    message: "Too many requests, please try again later",
    retryAfter: Math.round(options.windowMs / 1000),
    limit: options.limit,
    windowMs: options.windowMs,
  };

  // Log rate limit violations
  logger.warn("Rate limit exceeded:", {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.userId || "anonymous",
    timestamp: new Date().toISOString(),
  });

  return res.status(429).json(error);
};

// Skip rate limit in certain conditions
// eslint-disable-next-line
const skipRequests = (req, res) => {
  if (req.user?.role === "admin") {
    return true;
  }

  if (process.env.NODE_ENV === "development") {
    return true;
  }

  return false;
};

// General rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: skipRequests,
});

export default limiter;
