import { createFileRoute } from "@tanstack/react-router";

import Activity from "@/components/about/mobile/activity";
import Bio from "@/components/about/mobile/bio";
import Links from "@/components/about/mobile/links";
import Profile from "@/components/about/mobile/profile";
import { buildPageHead } from "@/config/seo";
import { nav_main_about } from "@/paraglide/messages";

const AboutPage = () => (
  <div className="py-6">
    <Profile />
    <Bio />
    <Links />
    <Activity />
  </div>
);

export const Route = createFileRoute("/m/about")({
  component: AboutPage,
  head: () => buildPageHead("/about", nav_main_about()),
});
