import Redis from "ioredis";
import { Service } from "typedi";
import { REDIS_URL } from "../config/app.config";

@Service()
class RedisClient {
  private static instance: RedisClient;
  private readonly client: Redis;

  private constructor() {
    this.client = new Redis(REDIS_URL);
    this.client.on("error", (err) => console.error("Redis Client Error", err));
    this.client.on("connect", () => console.log("✅ Connected to Redis"));
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  public getClient(): Redis {
    return this.client;
  }

  public async set(
    key: string,
    value: any,
    expireInSeconds?: number,
  ): Promise<void> {
    if (expireInSeconds) {
      await this.client.set(key, JSON.stringify(value), "EX", expireInSeconds);
    } else {
      await this.client.set(key, JSON.stringify(value));
    }
  }

  public async get(key: string): Promise<any> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }
}

export default RedisClient;
