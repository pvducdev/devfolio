import type { ProjectConfig } from "@/config/projects";
import { mobile_project_deps_title } from "@/paraglide/messages";

import DependencyList from "./dependency-list";
import DetailHeader from "./detail-header";
import ScreenshotGallery from "./screenshot-gallery";

interface ProjectDetailProps {
  project: ProjectConfig;
  index: number;
}

export default function ProjectDetail({ project, index }: ProjectDetailProps) {
  const allDeps = {
    ...project.package.dependencies,
    ...project.package.devDependencies,
  };

  return (
    <div className="flex flex-col gap-10">
      <DetailHeader index={index} project={project} />
      <ScreenshotGallery guides={project.guides} />
      <DependencyList deps={allDeps} title={mobile_project_deps_title()} />
    </div>
  );
}
