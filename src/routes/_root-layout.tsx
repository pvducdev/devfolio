import { createFileRoute } from "@tanstack/react-router";
import RootLayout from "@/components/layout/RootLayout.tsx";

export const Route = createFileRoute("/_root-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-blue-100 p-1">
      <RootLayout>Hello "/_root-layout"!</RootLayout>
    </div>
  );
}
