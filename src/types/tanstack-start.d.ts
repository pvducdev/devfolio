import type { ExecutionContext, RateLimit } from "@cloudflare/workers-types";

declare module "@tanstack/react-router" {
  interface Register {
    server: {
      requestContext: {
        env: {
          RATE_LIMITER: RateLimit;
        };
        ctx: ExecutionContext;
      };
    };
  }
}
