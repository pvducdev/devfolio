import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Fragment } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useBoolean } from "usehooks-ts";

import ButtonWithTooltip from "@/components/common/button-with-tooltip";
import { SearchGroup } from "@/components/search/search-group";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import type { AppSearchItem } from "@/config/search";
import { type CategoryKey, useAppSearch } from "@/hooks/use-search";
import { getDisplayKeys, getHotkeyCombo } from "@/lib/hotkeys";
import {
  ui_search_empty,
  ui_search_group_career,
  ui_search_group_pages,
  ui_search_group_skills,
  ui_search_hint_close,
  ui_search_hint_navigate,
  ui_search_hint_select,
  ui_search_placeholder,
  ui_search_title,
} from "@/paraglide/messages.js";

const getHeading = (key: CategoryKey): string => {
  const headings = {
    page: ui_search_group_pages(),
    skill: ui_search_group_skills(),
    career: ui_search_group_career(),
  };
  return headings[key];
};

export default function AppSearch() {
  const { value: open, toggle, setFalse: close } = useBoolean(false);
  const { query, setQuery, groups, hasResults } = useAppSearch();
  const navigate = useNavigate();

  useHotkeys(getHotkeyCombo("search"), toggle);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      close();
      setQuery("");
    }
  };

  const handleSelect = (item: AppSearchItem) => {
    const action = item.meta?.action;
    if (!action) {
      return;
    }

    if (action.type === "navigate") {
      navigate({ to: action.path });
    }

    setQuery("");
    close();
  };

  return (
    <>
      <ButtonWithTooltip
        className="size-7"
        onClick={toggle}
        size="icon"
        tooltip={
          <div className="flex items-center space-x-2">
            <span>{ui_search_title()}</span>
            <KbdGroup>
              {getDisplayKeys("search").map((key) => (
                <Kbd key={key}>{key}</Kbd>
              ))}
            </KbdGroup>
          </div>
        }
        variant="ghost"
      >
        <Search className="size-4" />
      </ButtonWithTooltip>
      <CommandDialog
        onOpenChange={handleOpenChange}
        open={open}
        shouldFilter={false}
      >
        <CommandInput
          onValueChange={setQuery}
          placeholder={ui_search_placeholder()}
          value={query}
        />
        <CommandList>
          {!hasResults && <CommandEmpty>{ui_search_empty()}</CommandEmpty>}

          {groups.map((group, index) => (
            <Fragment key={group.key}>
              {index > 0 && <CommandSeparator />}
              <SearchGroup
                heading={getHeading(group.key)}
                onSelect={handleSelect}
                results={group.results}
              />
            </Fragment>
          ))}
        </CommandList>
        <div className="flex items-center gap-4 border-t px-3 py-2 text-muted-foreground text-xs">
          <span className="flex items-center space-x-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            <span>{ui_search_hint_navigate()}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Kbd>↵</Kbd>
            <span>{ui_search_hint_select()}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Kbd>esc</Kbd>
            <span>{ui_search_hint_close()}</span>
          </span>
        </div>
      </CommandDialog>
    </>
  );
}
