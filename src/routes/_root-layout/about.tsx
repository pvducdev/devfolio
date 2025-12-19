import { createFileRoute } from "@tanstack/react-router";
import AboutPage from "@/components/about";

export const Route = createFileRoute("/_root-layout/about")({
  component: AboutPage,
});
