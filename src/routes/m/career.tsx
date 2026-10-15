import { createFileRoute } from "@tanstack/react-router";

import CareerTimeline from "@/components/career/mobile/career-timeline";
import { buildPageHead } from "@/config/seo";
import { nav_main_career } from "@/paraglide/messages";

export const Route = createFileRoute("/m/career")({
  component: CareerTimeline,
  head: () => buildPageHead("/career", nav_main_career()),
});
