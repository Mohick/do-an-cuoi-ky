// redis.ts
import { createClient } from "redis";

const storeRedis = createClient({
  url: process.env.REDIS_URL,
});

storeRedis.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedis() {
  try {
    if (!storeRedis.isOpen) {
      await storeRedis.connect();
      console.log("Redis connected");
    }
  } catch (error) {
    console.log(error);
  }
}

export { storeRedis, connectRedis };
