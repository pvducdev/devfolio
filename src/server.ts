import type { ExecutionContext } from "@cloudflare/workers-types";
import handler from "@tanstack/react-start/server-entry";

import { paraglideMiddleware } from "./paraglide/server.js";

// Tanstack start workaround for request cloning; remove once upstream is fixed.
const cloneRequest = (request: Request): Request =>
  new Request(request.url, {
    ...request,
    headers: new Headers(request.headers),
  });

export default {
  fetch(
    request: Request,
    env: unknown,
    ctx: ExecutionContext
  ): Response | Promise<Response> {
    return paraglideMiddleware(
      cloneRequest(request),
      ({ request: localizedRequest }) =>
        handler.fetch(localizedRequest, { context: { ctx, env } })
    );
  },
};
