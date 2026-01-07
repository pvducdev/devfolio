import { useServerFn } from "@tanstack/react-start";
import { Expand, GitBranch, Settings, Shrink } from "lucide-react";
import { Suspense } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useBoolean } from "usehooks-ts";
import AssistantTrigger from "@/components/assistant/trigger.tsx";
import ButtonWithTooltip from "@/components/common/button-with-tooltip.tsx";
import LanguageSwitcher from "@/components/common/language-switcher.tsx";
import KeyboardShortcutsModal from "@/components/keyboard-shortcuts/modal.tsx";
import AppSearch from "@/components/layout/app-search.tsx";
import RepoStarLink from "@/components/layout/repo-star-link.tsx";
import ResumeViewer from "@/components/resume-viewer/dialog-container.tsx";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SITE_CONFIG } from "@/config/site.ts";
import getRepoStarsFn from "@/fn/get-repo-stars.ts";
import { getDisplayKeys, getHotkeyCombo } from "@/lib/hotkeys";
import {
  ui_layout_normal,
  ui_layout_stretch,
  ui_settings_language,
  ui_settings_shortcuts,
  ui_settings_title,
} from "@/paraglide/messages.js";
import { useAppLayoutActions, useIsStretchLayout } from "@/store/app-layout.ts";

export default function Header() {
  const isStretchLayout = useIsStretchLayout();
  const { toggleStretchLayout } = useAppLayoutActions();
  const {
    value: shortcutsOpen,
    toggle: toggleShortcuts,
    setValue: setShortcutsOpen,
  } = useBoolean(false);
  const getRepoStars = useServerFn(getRepoStarsFn);

  useHotkeys(getHotkeyCombo("toggleLayout"), toggleStretchLayout);
  useHotkeys(getHotkeyCombo("showShortcuts"), toggleShortcuts);

  return (
    <header className="flex h-8 w-full items-center justify-between bg-sidebar">
      <div className="flex items-center pl-3">
        <ButtonWithTooltip
          className="group size-3 rounded-full bg-green-500 hover:bg-green-500"
          onClick={toggleStretchLayout}
          size="icon"
          tooltip={isStretchLayout ? ui_layout_normal() : ui_layout_stretch()}
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
        {!!SITE_CONFIG.features.showResumeViewer && (
          <ResumeViewer className="mr-32 flex items-center space-x-2" />
        )}
        <AssistantTrigger />
        <AppSearch />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ButtonWithTooltip
              className="size-7"
              size="icon"
              tooltip={ui_settings_title()}
              variant="ghost"
            >
              <Settings className="size-4" />
            </ButtonWithTooltip>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{ui_settings_language()}</DropdownMenuLabel>
            <LanguageSwitcher />
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={toggleShortcuts}>
                {ui_settings_shortcuts()}
                <DropdownMenuShortcut>
                  {getDisplayKeys("showShortcuts").join("")}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {!!SITE_CONFIG.features.showRepoStars && (
              <Suspense>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <RepoStarLink starPromise={getRepoStars()} />
                </DropdownMenuGroup>
              </Suspense>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <KeyboardShortcutsModal
          onOpenChange={setShortcutsOpen}
          open={shortcutsOpen}
        />
      </div>
    </header>
  );
}
