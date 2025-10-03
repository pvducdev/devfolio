import { FolderGit, User } from "lucide-react";

import ButtonWithTooltip from "@/components/common/ButtonWithTooltip.tsx";

export default function RootSidebar() {
  return (
    <div className="w-8 h-full bg-gray-100 border-r flex flex-col space-y-2 p-0.5 items-center">
      <ButtonWithTooltip
        className="size-7 cursor-pointer"
        size="icon"
        variant="ghost"
        tooltip="About me"
        tooltipProps={{ side: "right" }}
      >
        <User />
      </ButtonWithTooltip>
      <ButtonWithTooltip
        className="size-7 cursor-pointer"
        size="icon"
        variant="ghost"
        tooltip="Projects"
        tooltipProps={{ side: "right" }}
      >
        <FolderGit />
      </ButtonWithTooltip>
    </div>
  );
}
