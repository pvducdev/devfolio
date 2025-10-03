import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_root-layout/welcome")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_root-layout/welcome"!</div>;
}
