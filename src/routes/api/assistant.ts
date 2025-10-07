import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { generateMessage } from "@/lib/gemini";

export const Route = createFileRoute("/api/assistant")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { message } = await request.json();
        if (!message) {
          return new Response("Message is required", { status: 400 });
        }

        const result = await generateMessage(message);

        return json(result);
      },
    },
  },
});
