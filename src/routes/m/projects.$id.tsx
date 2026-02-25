import { createFileRoute } from "@tanstack/react-router";
import ProjectDetail from "@/components/project/mobile/project-detail.tsx";
import { getProjectById, getProjectIndex } from "@/config/projects";
import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";

export const Route = createFileRoute("/m/projects/$id")({
  head: ({ params }) => {
    const project = getProjectById(params.id);
    return {
      meta: [
        {
          title: `${project.name || params.id} | ${SITE_CONFIG.title}`,
        },
      ],
      links: buildCanonicalLink(`${SITE_CONFIG.url}/projects/${params.id}`),
    };
  },
  component: MobileProjectDetail,
});

function MobileProjectDetail() {
  const { id } = Route.useParams();
  const project = getProjectById(id);
  const index = getProjectIndex(id);

  return (
    <div className="py-6">
      <ProjectDetail project={project} index={index} />
    </div>
  );
}
