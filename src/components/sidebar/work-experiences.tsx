import { Play } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
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
        <div className="mb-2 font-medium text-sm">Career Journey</div>
        <p className="mb-3 text-muted-foreground text-xs">
          View my career as an interactive side-scrolling timeline
        </p>
        <Button
          className="w-full gap-2"
          onClick={handleOpenCareerRunner}
          size="sm"
          variant="secondary"
        >
          <Play className="size-4" />
          Open Career Runner
        </Button>
      </div>
    </div>
  );
}
