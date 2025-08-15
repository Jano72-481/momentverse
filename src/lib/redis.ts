import { Redis } from "ioredis";

let _redis: Redis | null = null;

export function redis() {
  if (!_redis) {
    if (process.env.REDIS_URL) {
      _redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        enableAutoPipelining: true,
        lazyConnect: true,
        retryDelayOnFailover: 100,
      });
    } else {
      // Fallback for development without Redis
      console.warn('Redis not configured, using in-memory fallback');
      _redis = null;
    }
  }
  return _redis;
}

export async function cached<T>(key: string, ttlSec: number, loader: () => Promise<T>): Promise<T> {
  const r = redis();
  if (!r) {
    // Fallback to direct loading without cache
    return await loader();
  }
  
  try {
    const hit = await r.get(key);
    if (hit) return JSON.parse(hit) as T;
  } catch (error) {
    console.warn('Redis cache miss due to error:', error);
  }
  
  const val = await loader();
  
  try {
    await r.setex(key, ttlSec, JSON.stringify(val));
  } catch (error) {
    console.warn('Redis cache set failed:', error);
  }
  
  return val;
}

export async function invalidate(keys: string[]) {
  const r = redis();
  if (!r || keys.length === 0) return;
  
  try {
    await r.del(...keys);
  } catch (error) {
    console.warn('Redis cache invalidation failed:', error);
  }
}

export async function invalidatePattern(pattern: string) {
  const r = redis();
  if (!r) return;
  
  try {
    const keys = await r.keys(pattern);
    if (keys.length > 0) {
      await r.del(...keys);
    }
  } catch (error) {
    console.warn('Redis pattern invalidation failed:', error);
  }
}
