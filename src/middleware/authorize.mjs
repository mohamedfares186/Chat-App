import { logger } from "./logger.mjs";

// Role-based authorization middleware
const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const role = req.user.role;
      if (!allowedRoles.includes(role)) {
        logger.warn("Role access denied:", {
          userId: req.user.userId,
          userRole: req.user.role,
          requiredRoles: allowedRoles,
          userAgent: req.headers["user-agent"],
          ip: req.ip,
        });
        return res.status(403).json({ error: "Forbidden" });
      }

      return next();
    } catch (error) {
      logger.warn("Authorization error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

// Permission-based authorization middleware
const requirePermission =
  (...requiredPermissions) =>
  (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const userPermissions = user.permissions || [];

      // Check if user has any of the required permissions
      const hasPermission = requiredPermissions.some((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        logger.warn("Permission access denied:", {
          userId: req.user.userId,
          userPermissions: userPermissions,
          requiredPermissions: requiredPermissions,
          userAgent: req.headers["user-agent"],
          ip: req.ip,
        });
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      return next();
    } catch (error) {
      logger.warn("Permission authorization error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

// Combined role and permission authorization
const authorizeWithPermission =
  (allowedRoles = [], requiredPermissions = []) =>
  (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      // Check role if specified
      if (allowedRoles.length > 0) {
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
          logger.warn("Role access denied:", {
            userId: req.user.userId,
            userRole: req.user.role,
            requiredRoles: allowedRoles,
            userAgent: req.headers["user-agent"],
            ip: req.ip,
          });
          return res.status(403).json({ error: "Forbidden" });
        }
      }

      // Check permissions if specified
      if (requiredPermissions.length > 0) {
        const userPermissions = user.permissions || [];
        const hasPermission = requiredPermissions.some((permission) =>
          userPermissions.includes(permission)
        );

        if (!hasPermission) {
          logger.warn("Permission access denied:", {
            userId: req.user.userId,
            userPermissions: userPermissions,
            requiredPermissions: requiredPermissions,
            userAgent: req.headers["user-agent"],
            ip: req.ip,
          });
          return res.status(403).json({ error: "Insufficient permissions" });
        }
      }

      return next();
    } catch (error) {
      logger.warn("Combined authorization error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

export { authorize, requirePermission, authorizeWithPermission };
