import { createFileRoute } from "@tanstack/react-router";
import SkillsPage from "@/components/skills";

export const Route = createFileRoute("/_root-layout/skills")({
  component: SkillsPage,
});
