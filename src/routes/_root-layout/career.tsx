import { createFileRoute } from "@tanstack/react-router";

import CareerRunner from "@/components/career/runner/career-runner";
import { buildPageHead } from "@/components/seo/head";
import { nav_main_career } from "@/paraglide/messages";

export const Route = createFileRoute("/_root-layout/career")({
  component: CareerRunner,
  head: () => buildPageHead("/career", nav_main_career()),
});
