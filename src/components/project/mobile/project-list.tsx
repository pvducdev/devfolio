import type { ProjectConfig } from "@/config/projects";

import ListingHeader from "./listing-header.tsx";
import ProjectRow from "./project-row.tsx";

interface ProjectListProps {
  projects: ProjectConfig[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <div>
      <ListingHeader count={projects.length} />
      <div className="mt-4">
        {projects.map((project, index) => (
          <ProjectRow index={index} key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
