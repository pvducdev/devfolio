import { Expand, GitBranch, Settings, Shrink } from "lucide-react";
import AssistantTrigger from "@/components/assistant/trigger.tsx";
import ButtonWithTooltip from "@/components/common/button-with-tooltip.tsx";
import AppSearch from "@/components/layout/app-search.tsx";
import ResumeViewer from "@/components/resume-viewer/dialog-container.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SITE_CONFIG } from "@/config/site.ts";
import { useKeyboardShortcut } from "@/hooks/use-keyboard.ts";
import { useAppLayoutStore } from "@/store/app-layout.ts";
import { Badge } from "../ui/badge";

export default function Header() {
  const isStretchLayout = useAppLayoutStore((state) => state.isStretchLayout);
  const toggleStretchLayout = useAppLayoutStore(
    (state) => state.toggleStretchLayout
  );

  useKeyboardShortcut("mod+shift+f", toggleStretchLayout);

  return (
    <header className="flex h-8 w-full items-center justify-between bg-sidebar">
      <div className="flex items-center pl-3">
        <ButtonWithTooltip
          className="group size-3 rounded-full bg-green-500 hover:bg-green-500"
          onClick={toggleStretchLayout}
          size="icon"
          tooltip={isStretchLayout ? "Normal Layout" : "Stretch Layout"}
        >
          {isStretchLayout ? (
            <Shrink className="size-2 opacity-0 transition-opacity group-hover:opacity-100" />
          ) : (
            <Expand className="size-2 opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </ButtonWithTooltip>
        <div className="ml-14 flex items-center space-x-2">
          <Badge className="rounded bg-primary px-1 text-primary-foreground hover:bg-primary/90">
            PP
          </Badge>
          <p className="font-medium text-xs">{SITE_CONFIG.title}</p>
        </div>
        <div className="ml-10 flex items-center space-x-2">
          <GitBranch className="size-4" />
          <p className="font-medium text-xs">v{SITE_CONFIG.version}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 pr-1">
        {SITE_CONFIG.features.showResumeViewer && (
          <ResumeViewer className="mr-32 flex items-center space-x-2" />
        )}
        <AssistantTrigger />
        <AppSearch />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ButtonWithTooltip
              className="size-7"
              size="icon"
              tooltip="Settings"
              variant="ghost"
            >
              <Settings className="size-4" />
            </ButtonWithTooltip>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Keyboard shortcuts
                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Team</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
