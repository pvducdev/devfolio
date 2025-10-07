import { Download, FileUser, GitBranch, Settings } from "lucide-react";
import ButtonWithTooltip from "@/components/common/ButtonWithTooltip.tsx";
import AppSearch from "@/components/layout/AppSearch.tsx";
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

export default function RootHeader() {
  return (
    <div className="w-full bg-black h-8 flex items-center justify-between">
      <div className="flex items-center pl-3">
        <Button className="rounded-full size-3 bg-green-500" size="icon" />
        <div className="ml-14 flex items-center space-x-2">
          <Badge className="bg-pink-500 text-white px-1 rounded">PP</Badge>
          <p className="text-white text-xs">PVD's portfolio</p>
        </div>
        <div className="ml-10 flex items-center space-x-2">
          <GitBranch className="text-white size-4" />
          <p className="text-white text-xs">v0.1</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 pr-1">
        <div className="flex mr-32 items-center space-x-2">
          <FileUser className="size-4" />
          <p className="text-white text-xs">My CV</p>
          <Button
            className="size-6 text-center cursor-pointer bg-pink-500 hover:bg-pink-600"
            size="icon"
          >
            <Download className="size-3" />
          </Button>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="size-7 hover:bg-transparent cursor-pointer"
        >
          <div className="size-5 rounded-full bg-pink-200" />
        </Button>
        <AppSearch />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ButtonWithTooltip
              size="icon"
              variant="ghost"
              className="size-7 hover:bg-white/20 cursor-pointer"
              tooltip="Settings"
            >
              <Settings className="text-white size-4" />
            </ButtonWithTooltip>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
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
    </div>
  );
}
