import { createFileRoute } from "@tanstack/react-router";
import AboutPage from "@/components/about";
import { env } from "@/env/client";
import type { ContributionData } from "@/lib/contributions";

export const Route = createFileRoute("/_root-layout/about")({
  loader: async () => ({
    contributions: await fetch(`${env.VITE_BASE_URL}/api/contributions`).then<
      ContributionData[]
    >((res) => res.json()),
  }),
  component: AboutPage,
});
