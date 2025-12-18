import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { object, optional, safeParse, string } from "valibot";
import { fetchContributions } from "@/lib/contributions";

const QuerySchema = object({
  from: optional(string()),
  to: optional(string()),
});

export const Route = createFileRoute("/api/contributions")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const result = safeParse(QuerySchema, {
          from: url.searchParams.get("from") ?? undefined,
          to: url.searchParams.get("to") ?? undefined,
        });

        if (!result.success) {
          return json({ error: "Invalid query parameters" }, { status: 400 });
        }

        const { from, to } = result.output;
        const data = await fetchContributions(
          from && to ? { from, to } : undefined
        );

        return json(data);
      },
    },
  },
});
