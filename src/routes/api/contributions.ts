import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { fetchContributions } from "@/lib/contributions";

export const Route = createFileRoute("/api/contributions")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const from = url.searchParams.get("from") as string;
        const to = url.searchParams.get("to") as string;

        const data = await fetchContributions({ from, to });

        return json(data);
      },
    },
  },
});
