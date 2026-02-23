// Simple in-memory rate limiter for serverless
// Tracks requests per key (IP or userId) within a sliding window

const requests = new Map<string, number[]>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of requests) {
    const valid = timestamps.filter((t) => now - t < 3600000); // 1 hour window
    if (valid.length === 0) requests.delete(key);
    else requests.set(key, valid);
  }
}, 60000);

export function rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = requests.get(key) || [];
  const valid = timestamps.filter((t) => now - t < windowMs);

  if (valid.length >= maxRequests) {
    return false; // Rate limited
  }

  valid.push(now);
  requests.set(key, valid);
  return true; // Allowed
}

export function getRateLimitHeaders(key: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const timestamps = requests.get(key) || [];
  const valid = timestamps.filter((t) => now - t < windowMs);
  const remaining = Math.max(0, maxRequests - valid.length);

  return {
    "X-RateLimit-Limit": String(maxRequests),
    "X-RateLimit-Remaining": String(remaining),
  };
}
