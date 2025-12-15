import { Suspense } from "react";
import { getPageComponent } from "@/config/page";
import {
  msg_error_fileload,
  msg_error_filepath,
  ui_state_loading,
} from "@/paraglide/messages.js";
import type { Tab } from "@/store/tabs.ts";

type ContentViewerProps = {
  tab: Tab;
};

export default function ContentViewer({ tab }: ContentViewerProps) {
  const PageComponent = getPageComponent(tab.pageId);

  if (!PageComponent) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-destructive">{msg_error_fileload()}</p>
          <p className="text-muted-foreground text-sm">
            Page not found: {tab.pageId}
          </p>
          <p className="mt-2 text-muted-foreground text-xs">
            {msg_error_filepath()}
          </p>
        </div>
      </div>
    );
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
