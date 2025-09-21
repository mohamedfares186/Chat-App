import slowDown from "express-slow-down";
import { logger } from "./logger.mjs";

// Slow down handler
const slowDownHandler = (req, res, next, options) => {
  const error = {
    status: "error",
    message: "Too many requests, please try again later",
    retryAfter: Math.round(options.windowMs / 1000),
    limit: options.delayAfter,
    windowMs: options.windowMs,
  };

  logger.warn("Speed limit exceeded:", {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.userId || "anonymous",
    timestamp: new Date().toISOString(),
  });

  return res.status(429).json(error);
};

// Skip requests in certain conditions
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

const speedLimiter = slowDown({
  windowMs: 60 * 1000, // 1 minute
  delayAfter: 30,
  delayMs: 500,
  maxDelayMs: 5 * 1000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: slowDownHandler,
  skip: skipRequests,
});

export default speedLimiter;
