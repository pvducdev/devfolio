import riveWASMResource from "@rive-app/canvas/rive.wasm";
import { createFileRoute } from "@tanstack/react-router";
import CareerRunner from "@/components/career-runner/career-runner";
import "@/lib/rive-init.ts";

export const Route = createFileRoute("/_root-layout/career")({
  head: () => ({
    links: [
      {
        rel: "preload",
        href: riveWASMResource,
        as: "fetch",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/character.riv",
        as: "fetch",
        crossOrigin: "anonymous",
      },
    ],
  }),
  component: CareerRunner,
});
