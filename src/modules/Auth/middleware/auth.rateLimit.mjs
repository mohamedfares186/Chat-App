import rateLimit from "express-rate-limit";
import { logger } from "./logger.mjs";

/**
 * Auth-specific rate limiting configurations
 */

// Login rate limiter
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  message: {
    error: "Too many login attempts, please try again later",
    retryAfter: 15 * 60, // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn("Login rate limit exceeded:", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      timestamp: new Date().toISOString(),
    });

    res.status(429).json({
      error: "Too many login attempts, please try again later",
      retryAfter: 15 * 60,
    });
  },
});

// Registration rate limiter
export const registerLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  limit: 10, // 3 registrations per hour
  message: {
    error: "Too many registration attempts, please try again later",
    retryAfter: 60 * 60, // 1 hour in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn("Registration rate limit exceeded:", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      timestamp: new Date().toISOString(),
    });

    res.status(429).json({
      error: "Too many registration attempts, please try again later",
      retryAfter: 60 * 60,
    });
  },
});

// Password reset rate limiter
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 10,
  message: {
    error: "Too many password reset attempts, please try again later",
    retryAfter: 60 * 60, // 1 hour in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn("Password reset rate limit exceeded:", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      timestamp: new Date().toISOString(),
    });

    res.status(429).json({
      error: "Too many password reset attempts, please try again later",
      retryAfter: 60 * 60,
    });
  },
});

// Email verification rate limiter
export const emailVerificationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 3,
  message: {
    error: "Too many email verification attempts, please try again later",
    retryAfter: 5 * 60, // 5 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn("Email verification rate limit exceeded:", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      timestamp: new Date().toISOString(),
    });

    res.status(429).json({
      error: "Too many email verification attempts, please try again later",
      retryAfter: 5 * 60,
    });
  },
});

// Token refresh rate limiter
export const tokenRefreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: {
    error: "Too many token refresh attempts, please try again later",
    retryAfter: 15 * 60, // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn("Token refresh rate limit exceeded:", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      timestamp: new Date().toISOString(),
    });

    res.status(429).json({
      error: "Too many token refresh attempts, please try again later",
      retryAfter: 15 * 60,
    });
  },
});
