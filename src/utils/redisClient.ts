// src/utils/redisClient.ts
import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;
let isConnecting = false;

export const getRedisClient = async () => {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on("connect", () => {
      console.log("✅ Redis connected");
    });

    redisClient.on("error", (err) => {
      console.error("❌ Redis error:", err);
    });
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
