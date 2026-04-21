import Redis from "ioredis";
import { createKeyv } from "@keyv/redis";
import { Keyv } from "keyv";
import { CacheableMemory } from "cacheable";
import { ConfigEnvironment } from "./config.environment";

export const createCacheConfig = async (config: ConfigEnvironment) => {
    const redisURL = `redis://${config.redisHost || "localhost"}:${config.redisPort || 6379}`;
    const healthCheckClient = new Redis(redisURL, {
        connectTimeout: 1000,
        maxRetriesPerRequest: 2
    });

    try {
        await healthCheckClient.ping();
        healthCheckClient.disconnect();

        const redisStore = createKeyv(redisURL, {
            throwOnConnectError: false,
            connectionTimeout: 1000
        });

        redisStore.on("error", (error: Error) => {
            console.error("Redis cache store error:", error);
        });

        console.info(`Redis cache connected at ${config.redisHost}:${config.redisPort}`);
        return redisStore;
    } catch (err) {
        healthCheckClient.disconnect();
        console.warn("Redis cache unavailable, falling back to in-memory:", err);

        return new Keyv({
            store: new CacheableMemory({ ttl: 60000, lruSize: 5000 })
        });
    }
};
