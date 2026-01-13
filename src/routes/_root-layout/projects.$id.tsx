import { createFileRoute } from "@tanstack/react-router";
import {Container} from "@/components/project/container.tsx";

export const Route = createFileRoute("/_root-layout/projects/$id")({
  component: () => <Container projectId={Route.useParams().id}/>,
});
