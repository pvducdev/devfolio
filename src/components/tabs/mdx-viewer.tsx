import { Suspense, useState } from "react";
import { useMount } from "@/hooks/use-mount";
import type { Tab } from "@/types/tabs";

type MDXViewerProps = {
  tab: Tab;
};

export default function MDXViewer({ tab }: MDXViewerProps) {
  const [MDXContent, setMDXContent] = useState<React.ComponentType | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useMount(() => {
    loadMDXContent();
  });

  async function loadMDXContent() {
    setError(null);

    try {
      // Dynamic import of MDX files compiled by Vite
      // The filePath should be relative to src (e.g., "content/about")
      // Note: Vite requires static file extension in dynamic imports
      const module = await import(`../../${tab.filePath}.mdx`);
      setMDXContent(() => module.default);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load MDX file");
    }
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-destructive">Error loading file</p>
          <p className="text-muted-foreground text-sm">{error}</p>
          <p className="mt-2 text-muted-foreground text-xs">
            Make sure the file path is relative to src/ directory
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Loading {tab.label}...</p>
            </div>
          }
        >
          {MDXContent && <MDXContent />}
        </Suspense>
      </article>
    </div>
  );
}
