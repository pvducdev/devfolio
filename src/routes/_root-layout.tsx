import { createFileRoute } from "@tanstack/react-router";
import CodeEditorContainer from "@/components/code-editor/container.tsx";
import Container from "@/components/layout/Container.tsx";

export const Route = createFileRoute("/_root-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-blue-100 p-1">
      <Container>
        <CodeEditorContainer />
      </Container>
    </div>
  );
}
