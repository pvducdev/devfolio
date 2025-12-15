import { Suspense } from "react";
import { getPageComponent } from "@/config/page";
import { ui_state_loading } from "@/paraglide/messages.js";
import type { Tab } from "@/store/tabs.ts";
import PageNotFound from "./page-not-found";

type ContentViewerProps = {
  tab: Tab;
};

export default function ContentViewer({ tab }: ContentViewerProps) {
  const PageComponent = getPageComponent(tab.pageId);

  if (!PageComponent) {
    return <PageNotFound pageId={tab.pageId} />;
  }

  return (
    <div className="size-full overflow-auto">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center p-6">
            <p className="text-muted-foreground">
              {ui_state_loading()} {tab.label}
            </p>
          </div>
        }
      >
        <PageComponent />
      </Suspense>
    </div>
  );
}
