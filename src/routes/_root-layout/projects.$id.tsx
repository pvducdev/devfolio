import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/project/container.tsx";
import { getProjectById } from "@/config/projects";
import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { nav_main_projects } from "@/paraglide/messages";

export const Route = createFileRoute("/_root-layout/projects/$id")({
  head: ({ params }) => {
    const project = getProjectById(params.id);
    return {
      meta: [
        {
          title: project.name
            ? `${project.name} | ${SITE_CONFIG.title}`
            : `${nav_main_projects()} | ${SITE_CONFIG.title}`,
        },
      ],
      links: buildCanonicalLink(`${SITE_CONFIG.url}/projects/${params.id}`),
    };
  },
  component: () => <Container projectId={Route.useParams().id} />,
});
