import { logger } from "./logger.mjs";

/**
 * Generic validation middleware factory
 */
export const validateRequest = (schema, sanitizeFn = null) => {
  return (req, res, next) => {
    try {
      // Sanitize input if sanitize function provided
      if (sanitizeFn) {
        req.body = sanitizeFn(req.body);
      }

      // Validate with Zod schema
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        logger.warn("Validation failed:", {
          errors,
          ip: req.ip,
          userAgent: req.get("User-Agent"),
          body: req.body,
        });

        return res.status(400).json({
          error: "Validation failed"
        });
      }

      // Replace req.body with validated and sanitized data
      req.body = result.data;
      next();
    } catch (error) {
      logger.error("Validation middleware error:", error);
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  };
};

/**
 * Validate query parameters
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.query);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          error: "Invalid query parameters"
        });
      }

      req.query = result.data;
      next();
    } catch (error) {
      logger.error("Query validation error:", error);
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  };
};

/**
 * Validate URL parameters
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.params);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          error: "Invalid URL parameters"
        });
      }

      req.params = result.data;
      next();
    } catch (error) {
      logger.error("Params validation error:", error);
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  };
};
