import { Download, FileUser, GitBranch, Settings } from "lucide-react";
import ButtonWithTooltip from "@/components/common/button-with-tooltip.tsx";
import AppSearch from "@/components/layout/app-search.tsx";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";

export default function Header() {
  return (
    <header className="flex h-8 w-full items-center justify-between bg-sidebar-foreground">
      <div className="flex items-center pl-3">
        <Button className="size-3 rounded-full bg-green-500" size="icon" />
        <div className="ml-14 flex items-center space-x-2">
          <Badge className="rounded bg-primary px-1 text-primary-foreground hover:bg-primary/90">
            PP
          </Badge>
          <p className="text-xs">PVD's portfolio</p>
        </div>
        <div className="ml-10 flex items-center space-x-2">
          <GitBranch className="size-4 text-white" />
          <p className="text-white text-xs">v0.1</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 pr-1">
        <div className="mr-32 flex items-center space-x-2">
          <FileUser className="size-4" />
          <p className="text-white text-xs">My CV</p>
          <Button
            className="size-6 cursor-pointer bg-primary text-center hover:bg-primary/80"
            size="icon"
          >
            <Download className="size-3" />
          </Button>
        </div>
        <Button
          className="size-7 cursor-pointer hover:bg-transparent"
          size="icon"
          variant="ghost"
        >
          <div className="size-5 rounded-full bg-pink-200" />
        </Button>
        <AppSearch />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ButtonWithTooltip
              className="size-7 cursor-pointer hover:bg-white/20"
              size="icon"
              tooltip="Settings"
              variant="ghost"
            >
              <Settings className="size-4 text-white" />
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
