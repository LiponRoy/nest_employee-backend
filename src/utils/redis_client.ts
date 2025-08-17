import config from "../config/index";
import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;
let isConnecting = false;

export const getRedisClient = async () => {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  if (!redisClient) {
    const isTls = config.redis.redis_url?.startsWith("rediss://");

    redisClient = createClient({
      url: config.redis.redis_url || process.env.REDIS_URL,
      socket: isTls
        ? {
            tls: true as const, // 👈 force literal type
            rejectUnauthorized: false,
          }
        : {}, // 👈 no socket config for non-TLS
    });

    redisClient.on("connect", () => console.log("✅ Redis connected"));
    redisClient.on("error", (err) => console.error("❌ Redis error:", err));
  }

  if (!redisClient.isOpen && !isConnecting) {
    try {
      isConnecting = true;
      await redisClient.connect();
    } catch (err) {
      console.error("❌ Redis connection failed:", err);
      throw new Error("Redis client not connected");
    } finally {
      isConnecting = false;
    }
  }

  return redisClient;
};
