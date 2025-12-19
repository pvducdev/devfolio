import { createFileRoute, redirect } from "@tanstack/react-router";
import { ROUTES } from "@/config/routes";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: ROUTES.HOME });
  },
});
