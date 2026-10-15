import { createFileRoute } from "@tanstack/react-router";

import { Container } from "@/components/project/container";
import { loadProject } from "@/config/projects";
import { buildPageHead } from "@/config/seo";

const ProjectPage = () => {
  // oxlint-disable-next-line no-use-before-define -- Route is defined below but referenced lazily at render time
  const project = Route.useLoaderData();
  return <Container key={project.id} project={project} />;
};

export const Route = createFileRoute("/_root-layout/projects/$id")({
  component: ProjectPage,
  head: ({ loaderData, params }) =>
    buildPageHead(`/projects/${params.id}`, loaderData?.name),
  loader: loadProject,
});
