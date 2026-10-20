import { createMiddleware } from "@tanstack/react-start";

const CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800";

export const cacheMiddleware = createMiddleware().server(async ({ next }) => {
  // oxlint-disable-next-line node/callback-return -- TanStack middleware must await next() to set headers on its response
  const result = await next();

  if (result.response.ok) {
    result.response.headers.set("Cache-Control", CACHE_CONTROL);
  }

  return result;
});
