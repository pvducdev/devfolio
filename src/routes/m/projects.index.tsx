import { createFileRoute } from "@tanstack/react-router";

import ProjectList from "@/components/project/mobile/project-list.tsx";
import { PROJECTS } from "@/config/projects";

const MobileProjects = () => (
  <div className="py-6">
    <ProjectList projects={PROJECTS} />
  </div>
);

export const Route = createFileRoute("/m/projects/")({
  component: MobileProjects,
});
