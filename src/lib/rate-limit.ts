interface RateLimitEntry {
  requestCount: number;
  windowExpiresAt: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

const requestHistory = new Map<string, RateLimitEntry>();
let lastCleanup = 0;

const DEFAULT_MAX_REQUESTS = 100;
const DEFAULT_WINDOW_MS = 60_000;
const CLEANUP_INTERVAL_MS = 60_000;

const cleanupExpiredEntries = () => {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) {
    return;
  }
  lastCleanup = now;
  for (const [clientId, entry] of requestHistory.entries()) {
    if (now > entry.windowExpiresAt) {
      requestHistory.delete(clientId);
    }
  }
};

export const checkRateLimit = (
  clientId: string,
  maxRequests = DEFAULT_MAX_REQUESTS,
  windowMs = DEFAULT_WINDOW_MS
): RateLimitResult => {
  cleanupExpiredEntries();
  const now = Date.now();
  const entry = requestHistory.get(clientId);

  const isNewOrExpiredWindow = !entry || now > entry.windowExpiresAt;

  if (isNewOrExpiredWindow) {
    requestHistory.set(clientId, {
      requestCount: 1,
      windowExpiresAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      retryAfterMs: windowMs,
    };
  }

  const hasExceededLimit = entry.requestCount >= maxRequests;

  if (hasExceededLimit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: entry.windowExpiresAt - now,
    };
  }

  entry.requestCount += 1;
  return {
    allowed: true,
    remaining: maxRequests - entry.requestCount,
    retryAfterMs: entry.windowExpiresAt - now,
  };
};

export const getClientIP = (request: Request): string =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("x-real-ip") ||
  request.headers.get("cf-connecting-ip") ||
  "anonymous";

export const createRateLimitResponse = (retryAfterMs: number): Response => {
  const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);

  return Response.json(
    { error: "Too Many Requests" },
    {
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
      status: 429,
    }
  );
};
