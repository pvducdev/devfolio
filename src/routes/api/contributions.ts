import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

import { fetchContributions } from "@/components/about/fetch-contributions";
import { cacheMiddleware } from "@/middleware/cache";
import { rateLimitMiddleware } from "@/middleware/rate-limit";

export const Route = createFileRoute("/api/contributions")({
  server: {
    handlers: {
      GET: async () => {
        const data = await fetchContributions();

        return json(data);
      },
    },
    middleware: [rateLimitMiddleware, cacheMiddleware],
  },
});
