import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

export const redis = createClient({
    host: process.env.REDIS_URL || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    // password: process.env.REDIS_PASSWORD || "kinjal",
    socket: {
        connectTimeout: 10000,
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000)
    }
});

export const redisConnect = async () => {
    try {
        await redis.connect();
        await redis.ping();
        console.log("Redis Database Connected Successfully");
    } catch (error) {
        console.error("Error in Redis Connection:", error);
        throw error;
    }
};
// import dotenv from "dotenv";
// import { createClient } from "redis";

// dotenv.config();

// export const redis = createClient({
//   socket: {
//     host: "localhost",     // Redis is running locally
//     port: 6379,            // Host port mapped to container's 6379
//     connectTimeout: 10000,
//     reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
//   },
//   password: "kinjal"       // Redis password
// });

// redis.on("error", (err) => {
//   console.error("❌ Redis Error:", err);
// });

// export const redisConnect = async () => {
//   try {
//     await redis.connect();
//     await redis.ping();
//     console.log("✅ Redis Database Connected Successfully");
//   } catch (error) {
//     console.error("❌ Error in Redis Connection:", error);
//     throw error;
//   }
// };
