import { type ComponentType, Suspense, useState } from "react";
import { useMount } from "@/hooks/use-mount";
import {
  error_failed_load,
  error_file_path_hint,
  error_loading_file,
  ui_loading,
} from "@/paraglide/messages.js";
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
      setError(err instanceof Error ? err.message : error_failed_load());
    }
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-destructive">{error_loading_file()}</p>
          <p className="text-muted-foreground text-sm">{error}</p>
          <p className="mt-2 text-muted-foreground text-xs">
            {error_file_path_hint()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full overflow-auto">
      <div className="prose prose-sm md:prose-base dark:prose-invert h-full max-w-none">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center p-6">
              <p className="text-muted-foreground">
                {ui_loading()} {tab.label}
              </p>
            </div>
          }
        >
          {!!MDXContent && <MDXContent />}
        </Suspense>
      </div>
    </div>
  );
}
