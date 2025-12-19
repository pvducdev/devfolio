import { createMiddleware } from "@tanstack/react-start";
import { SITE_CONFIG } from "@/config/site";

export const cacheMiddleware = createMiddleware().server(async ({ next }) => {
  const { maxAge, staleWhileRevalidate } = SITE_CONFIG.cache;
  const result = await next();

  result.response.headers.set(
    "Cache-Control",
    `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
  );

  return result;
});
