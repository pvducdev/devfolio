import { createMiddleware } from "@tanstack/react-start";

export const rateLimitMiddleware = createMiddleware().server(
  async ({ context, next, request }) => {
    const clientIP = request.headers.get("cf-connecting-ip") ?? "anonymous";
    const { success } = await context.env.RATE_LIMITER.limit({ key: clientIP });

    if (!success) {
      return Response.json({ error: "Too Many Requests" }, { status: 429 });
    }

    return next();
  }
);
