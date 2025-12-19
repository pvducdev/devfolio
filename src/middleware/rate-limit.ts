import { createMiddleware } from "@tanstack/react-start";
import { SITE_CONFIG } from "@/config/site";
import {
  checkRateLimit,
  createRateLimitResponse,
  getClientIP,
} from "@/lib/rate-limit";

export const rateLimitMiddleware = createMiddleware().server(
  ({ next, request }) => {
    const { maxRequests, windowMs } = SITE_CONFIG.rateLimit;
    const clientIP = getClientIP(request);
    const { allowed, retryAfterMs } = checkRateLimit(
      clientIP,
      maxRequests,
      windowMs
    );

    if (!allowed) {
      return createRateLimitResponse(retryAfterMs);
    }

    return next();
  }
);
