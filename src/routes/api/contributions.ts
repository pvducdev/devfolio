import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { fetchContributions } from "@/lib/contributions";
import createCacheMiddleware from "@/middleware/cache.ts";

export const Route = createFileRoute("/api/contributions")({
  server: {
    middleware: [createCacheMiddleware()],
    handlers: {
      GET: async () => {
        const data = await fetchContributions();

        return json(data);
      },
    },
  },
});
