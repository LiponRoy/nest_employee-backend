// utils/redisClient.ts
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('connect', () => {
  console.log(' Redis connected');
});

redisClient.on('error', (err) => {
  console.error(' Redis error:', err);
});

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export { redisClient, connectRedis };
