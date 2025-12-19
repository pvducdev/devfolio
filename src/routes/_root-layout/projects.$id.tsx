import { createFileRoute } from "@tanstack/react-router";
import ProjectPage from "@/components/project";

export const Route = createFileRoute("/_root-layout/projects/$id")({
  component: ProjectPage,
});
