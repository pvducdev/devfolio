import { type ComponentType, Suspense, useState } from "react";
import { useMount } from "@/hooks/use-mount";
import type { Tab } from "@/store/tabs.ts";

type MDXViewerProps = {
  tab: Tab;
};

const mdxModules = import.meta.glob<{ default: ComponentType }>(
  "/src/content/**/*.mdx"
);

export default function MDXViewer({ tab }: MDXViewerProps) {
  const [MDXContent, setMDXContent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useMount(() => {
    loadMDXContent();
  });

  async function loadMDXContent() {
    setError(null);

    try {
      const globKey = `/src/${tab.filePath}`;

      const moduleLoader = mdxModules[globKey];

      if (!moduleLoader) {
        throw new Error(
          `File not found: ${globKey}\nAvailable files: ${Object.keys(mdxModules).join(", ")}`
        );
      }

      const module = await moduleLoader();
      setMDXContent(() => module.default);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load file");
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
    <div className="size-full overflow-auto">
      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center p-6">
              <p className="text-muted-foreground">Loading {tab.label}...</p>
            </div>
          }
        >
          {MDXContent && <MDXContent />}
        </Suspense>
      </div>
    </div>
  );
}
