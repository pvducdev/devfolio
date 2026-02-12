import { createFileRoute } from "@tanstack/react-router";
import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { nav_main_projects } from "@/paraglide/messages";

export const Route = createFileRoute("/m/projects/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${nav_main_projects()} | ${SITE_CONFIG.title}` },
    ],
    links: buildCanonicalLink(`${SITE_CONFIG.url}/projects/${params.id}`),
  }),
  component: MobileProjectDetail,
});

function MobileProjectDetail() {
  const { id } = Route.useParams();

  return (
    <div className="py-6">
      <div className="mt-4 text-sm text-muted-foreground">
        <p>{">"} project {id} — coming soon</p>
      </div>
    </div>
  );
}
