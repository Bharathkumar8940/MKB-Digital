import { Redis } from '@upstash/redis';

// In-memory rate limiting map for local development fallback
const inMemoryStore = new Map<string, { count: number; expiresAt: number }>();

let redisClient: Redis | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch (error) {
    console.warn('Upstash Redis initialization failed, falling back to local rate limiter');
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Shared Rate Limiting function
 * @param identifier IP or user key
 * @param limit Max allowed attempts
 * @param windowSeconds Window duration in seconds
 */
export async function rateLimit(
  identifier: string,
  limit: number = 5,
  windowSeconds: number = 900 // 15 minutes
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();

  if (redisClient) {
    try {
      const count = await redisClient.incr(key);
      if (count === 1) {
        await redisClient.expire(key, windowSeconds);
      }
      const ttl = await redisClient.ttl(key);
      const remaining = Math.max(0, limit - count);

      return {
        success: count <= limit,
        limit,
        remaining,
        reset: now + (ttl > 0 ? ttl * 1000 : windowSeconds * 1000),
      };
    } catch (e) {
      console.warn('Redis rate limit query failed, falling back to in-memory store');
    }
  }

  // Local In-Memory Fallback Rate Limiter
  const existing = inMemoryStore.get(key);

  if (!existing || now > existing.expiresAt) {
    const expiresAt = now + windowSeconds * 1000;
    inMemoryStore.set(key, { count: 1, expiresAt });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: expiresAt,
    };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);

  return {
    success: existing.count <= limit,
    limit,
    remaining,
    reset: existing.expiresAt,
  };
}
