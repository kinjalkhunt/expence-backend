import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

export const redis = createClient({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    // password: process.env.REDIS_PASSWORD,
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

export const redisDisconnect = async () => {
    try {
        await redis.quit();
        console.log("Redis Database Disconnected Successfully");
    } catch (error) {
        console.error("Error in Redis Disconnection:", error);
        throw error;
    }
};

export const redisFlush = async () => {
    try {
        await redis.flushAll();
        console.log("Redis Database Flushed Successfully");
    } catch (error) {
        console.error("Error in Redis Flushing:", error);
        throw error;
    }
};