import type { ExecutionContext } from "@cloudflare/workers-types";
import type { Register } from "@tanstack/react-router";
import handler from "@tanstack/react-start/server-entry";

import { paraglideMiddleware } from "./paraglide/server.js";

const withMutableHeaders = (request: Request): Request =>
  new Request(request, { headers: new Headers(request.headers) });

export default {
  fetch(
    request: Request,
    env: Register["server"]["requestContext"]["env"],
    ctx: ExecutionContext
  ): Response | Promise<Response> {
    return paraglideMiddleware(
      withMutableHeaders(request),
      ({ request: localizedRequest }) =>
        handler.fetch(localizedRequest, { context: { ctx, env } })
    );
  },
};
