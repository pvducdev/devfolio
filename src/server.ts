import handler from "@tanstack/react-start/server-entry";
import {
  checkRateLimit,
  createRateLimitResponse,
  getClientIP,
} from "./lib/rate-limit";
import { paraglideMiddleware } from "./paraglide/server.js";

const RATE_LIMITED_ROUTES = ["/api/"];

export default {
  fetch(request: Request): Response | Promise<Response> {
    const url = new URL(request.url);
    const isRateLimited = RATE_LIMITED_ROUTES.some((route) =>
      url.pathname.startsWith(route)
    );

    if (isRateLimited) {
      const clientIP = getClientIP(request);
      const { allowed, retryAfterMs } = checkRateLimit(clientIP);

      if (!allowed) {
        return createRateLimitResponse(retryAfterMs);
      }
    }

    return paraglideMiddleware(request, ({ request: localizedRequest }) =>
      handler.fetch(localizedRequest)
    );
  },
};
