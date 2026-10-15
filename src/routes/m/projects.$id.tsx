import { createFileRoute } from "@tanstack/react-router";

import ProjectDetail from "@/components/project/mobile/project-detail";
import { getProjectIndex, loadProject } from "@/config/projects";
import { buildPageHead } from "@/config/seo";

const MobileProjectDetail = () => {
  // oxlint-disable-next-line no-use-before-define -- Route is defined below but referenced lazily at render time
  const project = Route.useLoaderData();

  return (
    <div className="py-6">
      <ProjectDetail project={project} index={getProjectIndex(project.id)} />
    </div>
  );
};

export const Route = createFileRoute("/m/projects/$id")({
  component: MobileProjectDetail,
  head: ({ loaderData, params }) =>
    buildPageHead(`/projects/${params.id}`, loaderData?.name),
  loader: loadProject,
});
