import { createMiddleware } from "@tanstack/react-start";

import { SITE_CONFIG } from "@/config/site";

export const cacheMiddleware = createMiddleware().server(async ({ next }) => {
  const { maxAge, staleWhileRevalidate } = SITE_CONFIG.cache;
  // oxlint-disable-next-line node/callback-return -- TanStack middleware must await next() to set headers on its response
  const result = await next();

  if (result.response.ok) {
    result.response.headers.set(
      "Cache-Control",
      `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
    );
  }

  return result;
});
