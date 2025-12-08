import { Play } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import {
  sidebar_career_description,
  sidebar_career_title,
  sidebar_open_career_runner,
} from "@/paraglide/messages.js";
import { useTabsStore } from "@/store/tabs";

export default function WorkExperiences() {
  const openTab = useTabsStore(useShallow((state) => state.openTab));

  const handleOpenCareerRunner = () => {
    openTab("content/career.mdx");
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-2">
      {/* Interactive Career Runner */}
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="mb-2 font-medium text-sm">{sidebar_career_title()}</div>
        <p className="mb-3 text-muted-foreground text-xs">
          {sidebar_career_description()}
        </p>
        <Button
          className="w-full gap-2"
          onClick={handleOpenCareerRunner}
          size="sm"
          variant="secondary"
        >
          <Play className="size-4" />
          {sidebar_open_career_runner()}
        </Button>
      </div>
    </div>
  );
}
