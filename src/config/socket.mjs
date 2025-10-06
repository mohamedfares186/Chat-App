import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import redis from "./redis.mjs";
import jwt from "jsonwebtoken";
import { logger } from "../middleware/logger.mjs";
import env from "./environment.mjs";

let io;

const initSocket = async (server) => {
  io = new Server(server, {
    cors: {
      origin: env.frontendUrl,
      credentials: true,
    },
  });

  // Redis adapter setup (pub/sub) - only if Redis is available
  if (env.redisUrl) {
    try {
      const pubClient = redis;
      const subClient = pubClient.duplicate();

      await pubClient.connect();
      await subClient.connect();
      io.adapter(createAdapter(pubClient, subClient));
      logger.info("Socket.io Redis adapter initialized");
    } catch (error) {
      logger.warn(
        "Failed to initialize Redis adapter for Socket.io:",
        error.message
      );
    }
  }

  // Auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) return next(new Error("Authentication error"));

    try {
      const user = jwt.verify(token, env.accessTokenSecret);
      socket.user = user; // attach user info to socket
      next();
    } catch (error) {
      logger.warn(`Socket authentication error: ${error}`);
      next(new Error("Unauthorized"));
    }
  });

  // Connection handler
  io.on("connection", (socket) => {
    logger.info(`User connected: ${socket.user.userId}`);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      io.to(roomId).emit("userJoined", { userId: socket.user.userId });
    });

    socket.on("message", ({ roomId, text }) => {
      const message = {
        userId: socket.user.userId,
        text,
        timestamp: Date.now(),
      };
      // Save message to DB (Prisma) here
      io.to(roomId).emit("message", message);
    });

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.user.userId}`);
    });
  });

  return io;
};

export default initSocket;
