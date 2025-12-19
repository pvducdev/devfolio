import { createFileRoute } from "@tanstack/react-router";
import CareerRunner from "@/components/career-runner/career-runner";

export const Route = createFileRoute("/_root-layout/career")({
  component: CareerRunner,
});
