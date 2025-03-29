
const cache = new Map();

export function cacheData(key: string, data: unknown, duration: number) {
  const expiry = Date.now() + duration;
  cache.set(key, { data, expiry });
}

export function getCachedData(key: string) {
  const cached = cache.get(key);

  if (!cached) {
    return null;
  }

  if (cached.expiry < Date.now()) {
    cache.delete(key);
    return null;
  }

  return cached.data;
}

export function clearCache() {
  cache.clear();
}

export function clearCacheKey(key: string) {
  cache.delete(key);
}