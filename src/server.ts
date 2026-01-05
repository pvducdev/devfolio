import handler from "@tanstack/react-start/server-entry";
import { paraglideMiddleware } from "./paraglide/server.js";

//FIXME: This is tanstack start issue, remove once fixed
function cloneRequest(request: Request): Request {
  return new Request(request.url, {
    ...request,
  });
}

export default {
  fetch(request: Request): Response | Promise<Response> {
    return paraglideMiddleware(
      cloneRequest(request),
      ({ request: localizedRequest }) => handler.fetch(localizedRequest)
    );
  },
};
