import { createMiddleware } from "@tanstack/react-start";

const createCacheMiddleware = (
  maxAge = 86_400,
  staleWhileRevalidate = 604_800
) =>
  createMiddleware().server(async ({ next }) => {
    const result = await next();

    result.response.headers.set(
      "Cache-Control",
      `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
    );

    return result;
  });

export default createCacheMiddleware;
