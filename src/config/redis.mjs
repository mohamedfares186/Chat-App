import Redis from "ioredis";
import { logger } from "../middleware/logger.mjs";
import env from "./environment.mjs";

const redis = new Redis(env.redisUrl, {
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redis.on("connect", () => {
  logger.info("Connected to Redis");
});

redis.on("error", (error) => {
  logger.error("Redis error:", error);
});

export default redis;
