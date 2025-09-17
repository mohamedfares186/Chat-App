import { PrismaClient } from "@prisma/client";
import { v4 } from "uuid";
import { logger } from "../middleware/logger.mjs";

const prisma = new PrismaClient();

class PermissionService {
  // Get user permissions (both role-based and individual permissions)
  static async getUserPermissions(userId) {
    try {
      const userWithRoles = await prisma.users.findUnique({
        where: { userId },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
          userPermissions: {
            include: {
              permission: true,
            },
          },
        },
      });

      if (!userWithRoles) {
        throw new Error("User not found");
      }

      // Get permissions from roles
      const rolePermissions = new Set();
      userWithRoles.userRoles.forEach((userRole) => {
        userRole.role.rolePermissions.forEach((rolePermission) => {
          rolePermissions.add(rolePermission.permission.name);
        });
      });

      // Get individual permissions (granted and revoked)
      const individualPermissions = {};
      userWithRoles.userPermissions.forEach((userPermission) => {
        individualPermissions[userPermission.permission.name] =
          userPermission.granted;
      });

      // Combine role permissions with individual permissions
      const allPermissions = new Set(rolePermissions);

      // Apply individual permission overrides
      Object.entries(individualPermissions).forEach(([permission, granted]) => {
        if (granted) {
          allPermissions.add(permission);
        } else {
          allPermissions.delete(permission);
        }
      });

      return Array.from(allPermissions);
    } catch (error) {
      logger.error("Error getting user permissions:", error);
      throw error;
    }
  }

  // Get user role (highest level role)
  static async getUserRole(userId) {
    try {
      const userWithRoles = await prisma.users.findUnique({
        where: { userId },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!userWithRoles || userWithRoles.userRoles.length === 0) {
        return null;
      }

      // Get the highest level role
      const highestRole = userWithRoles.userRoles.reduce((prev, current) => {
        return prev.role.level > current.role.level ? prev : current;
      });

      return highestRole.role.name;
    } catch (error) {
      logger.error("Error getting user role:", error);
      throw error;
    }
  }

  // Get all permissions
  static async getAllPermissions() {
    try {
      const permissions = await prisma.permissions.findMany({
        orderBy: { category: "asc" },
      });
      return permissions;
    } catch (error) {
      logger.error("Error getting all permissions:", error);
      throw error;
    }
  }

  // Grant user permission or permissions
  static async grantUserPermissions(userId, permissions, grantedBy) {
    try {
      const permissionArray = Array.isArray(permissions)
        ? permissions
        : [permissions];

      for (const permissionName of permissionArray) {
        // Find the permission
        const permission = await prisma.permissions.findUnique({
          where: { name: permissionName },
        });

        if (!permission) {
          throw new Error(`Permission '${permissionName}' not found`);
        }

        // Upsert the user permission
        await prisma.userPermissions.upsert({
          where: {
            userId_permissionId: {
              userId,
              permissionId: permission.permissionId,
            },
          },
          update: {
            granted: true,
            grantedBy,
            grantedAt: new Date(),
          },
          create: {
            userId,
            permissionId: permission.permissionId,
            granted: true,
            grantedBy,
          },
        });
      }

      logger.info(`Granted permissions to user ${userId}:`, permissionArray);
    } catch (error) {
      logger.error("Error granting user permissions:", error);
      throw error;
    }
  }

  // Revoke user permission or permissions
  static async revokeUserPermissions(userId, permissions, revokedBy) {
    try {
      const permissionArray = Array.isArray(permissions)
        ? permissions
        : [permissions];

      for (const permissionName of permissionArray) {
        // Find the permission
        const permission = await prisma.permissions.findUnique({
          where: { name: permissionName },
        });

        if (!permission) {
          throw new Error(`Permission '${permissionName}' not found`);
        }

        // Update the user permission to revoked
        await prisma.userPermissions.upsert({
          where: {
            userId_permissionId: {
              userId,
              permissionId: permission.permissionId,
            },
          },
          update: {
            granted: false,
            grantedBy: revokedBy,
            grantedAt: new Date(),
          },
          create: {
            userId,
            permissionId: permission.permissionId,
            granted: false,
            grantedBy: revokedBy,
          },
        });
      }

      logger.info(`Revoked permissions from user ${userId}:`, permissionArray);
    } catch (error) {
      logger.error("Error revoking user permissions:", error);
      throw error;
    }
  }

  // Initialize default permissions
  static async initializeDefaultPermissions() {
    try {
      const defaultPermissions = [
        // User permissions
        {
          name: "user:read",
          description: "View user profiles",
          category: "user",
        },
        {
          name: "user:update:self",
          description: "Update own profile",
          category: "user",
        },
        {
          name: "user:delete:self",
          description: "Delete own account",
          category: "user",
        },
        {
          name: "user:update:any",
          description: "Update any user profile",
          category: "user",
        },
        {
          name: "user:delete:any",
          description: "Delete any user account",
          category: "user",
        },
        { name: "user:ban", description: "Ban users", category: "user" },

        // Room permissions
        { name: "room:create", description: "Create rooms", category: "room" },
        { name: "room:join", description: "Join rooms", category: "room" },
        { name: "room:leave", description: "Leave rooms", category: "room" },
        {
          name: "room:update",
          description: "Update room settings",
          category: "room",
        },
        { name: "room:delete", description: "Delete rooms", category: "room" },
        {
          name: "room:invite",
          description: "Invite users to rooms",
          category: "room",
        },
        {
          name: "room:remove",
          description: "Remove users from rooms",
          category: "room",
        },
        {
          name: "room:ban",
          description: "Ban users from rooms",
          category: "room",
        },

        // Message permissions
        {
          name: "message:send",
          description: "Send messages",
          category: "message",
        },
        {
          name: "message:edit:self",
          description: "Edit own messages",
          category: "message",
        },
        {
          name: "message:delete:self",
          description: "Delete own messages",
          category: "message",
        },
        {
          name: "message:delete:any",
          description: "Delete any messages",
          category: "message",
        },

        // Media permissions
        {
          name: "media:upload",
          description: "Upload media files",
          category: "media",
        },
        {
          name: "media:delete:self",
          description: "Delete own media",
          category: "media",
        },
        {
          name: "media:delete:any",
          description: "Delete any media",
          category: "media",
        },

        // Admin permissions
        {
          name: "admin:dashboard",
          description: "Access admin dashboard",
          category: "admin",
        },
        { name: "admin:users", description: "Manage users", category: "admin" },
        {
          name: "admin:content",
          description: "Manage content",
          category: "admin",
        },
        {
          name: "admin:system",
          description: "Manage system settings",
          category: "admin",
        },

        // Moderation permissions
        {
          name: "mod:messages:delete",
          description: "Delete messages as moderator",
          category: "moderation",
        },
        {
          name: "mod:users:mute",
          description: "Mute users",
          category: "moderation",
        },
        {
          name: "mod:reports:view",
          description: "View reports",
          category: "moderation",
        },
        {
          name: "mod:reports:resolve",
          description: "Resolve reports",
          category: "moderation",
        },
      ];

      // Create permissions if they don't exist
      for (const perm of defaultPermissions) {
        await prisma.permissions.upsert({
          where: { name: perm.name },
          update: {},
          create: {
            permissionId: v4(),
            ...perm,
          },
        });
      }

      logger.info("Default permissions initialized successfully");
    } catch (error) {
      logger.error("Error initializing default permissions:", error);
      throw error;
    }
  }

  // Initialize default roles
  static async initializeDefaultRoles() {
    try {
      const defaultRoles = [
        {
          name: "USER",
          description: "Regular user with basic permissions",
          level: 1,
        },
        {
          name: "MODERATOR",
          description: "Moderator with content management permissions",
          level: 2,
        },
        {
          name: "ADMIN",
          description: "Administrator with full system access",
          level: 3,
        },
      ];

      // Create roles if they don't exist
      for (const role of defaultRoles) {
        await prisma.roles.upsert({
          where: { name: role.name },
          update: {},
          create: {
            roleId: v4(),
            ...role,
          },
        });
      }

      // Assign default permissions to roles
      await this.assignDefaultRolePermissions();

      logger.info("Default roles initialized successfully");
    } catch (error) {
      logger.error("Error initializing default roles:", error);
      throw error;
    }
  }

  // Assign default permissions to roles
  static async assignDefaultRolePermissions() {
    try {
      // Get all roles and permissions
      const [userRole, moderatorRole, adminRole] = await Promise.all([
        prisma.roles.findUnique({ where: { name: "USER" } }),
        prisma.roles.findUnique({ where: { name: "MODERATOR" } }),
        prisma.roles.findUnique({ where: { name: "ADMIN" } }),
      ]);

      const permissions = await prisma.permissions.findMany();

      // User permissions
      const userPermissions = [
        "user:read",
        "user:update:self",
        "user:delete:self",
        "room:join",
        "room:leave",
        "message:send",
        "message:edit:self",
        "message:delete:self",
        "media:upload",
        "media:delete:self",
      ];

      // Moderator permissions (includes all user permissions)
      const moderatorPermissions = [
        ...userPermissions,
        "mod:messages:delete",
        "mod:users:mute",
        "mod:reports:view",
        "mod:reports:resolve",
        "message:delete:any",
        "room:create",
        "room:invite",
        "room:remove",
        "room:ban",
      ];

      // Admin permissions (includes all permissions)
      const adminPermissions = permissions.map((p) => p.name);

      // Assign permissions to roles
      await this.assignPermissionsToRole(userRole.roleId, userPermissions);
      await this.assignPermissionsToRole(
        moderatorRole.roleId,
        moderatorPermissions
      );
      await this.assignPermissionsToRole(adminRole.roleId, adminPermissions);

      logger.info("Default role permissions assigned successfully");
    } catch (error) {
      logger.error("Error assigning default role permissions:", error);
      throw error;
    }
  }

  // Helper method to assign permissions to a role
  static async assignPermissionsToRole(roleId, permissionNames) {
    for (const permissionName of permissionNames) {
      const permission = await prisma.permissions.findUnique({
        where: { name: permissionName },
      });

      if (permission) {
        await prisma.rolePermissions.upsert({
          where: {
            roleId_permissionId: {
              roleId,
              permissionId: permission.permissionId,
            },
          },
          update: {},
          create: {
            roleId,
            permissionId: permission.permissionId,
          },
        });
      }
    }
  }

  // Assign default role to new user
  static async assignDefaultUserRole(userId) {
    try {
      const userRole = await prisma.roles.findUnique({
        where: { name: "USER" },
      });

      if (userRole) {
        await prisma.userRoles.upsert({
          where: {
            userId_roleId: {
              userId,
              roleId: userRole.roleId,
            },
          },
          update: {},
          create: {
            userId,
            roleId: userRole.roleId,
          },
        });

        logger.info(`Assigned USER role to user ${userId}`);
      }
    } catch (error) {
      logger.error("Error assigning default user role:", error);
      throw error;
    }
  }
}

export default PermissionService;
