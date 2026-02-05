import type { ExecutionContext } from "@cloudflare/workers-types";

declare module "@tanstack/react-router" {
  interface Register {
    server: {
      requestContext: {
        env: unknown;
        ctx: ExecutionContext;
      };
    };
  }
}
