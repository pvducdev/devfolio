import RootLayout from "@/components/layout/RootLayout.tsx";

import {createFileRoute} from "@tanstack/react-router";

export const Route = createFileRoute("/_root-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-accent p-1">
      <RootLayout>Hello "/_root-layout"!</RootLayout>
    </div>
  );
}
