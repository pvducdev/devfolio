import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Fragment } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useBoolean } from "usehooks-ts";

import ButtonWithTooltip from "@/components/common/button-with-tooltip";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
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

import type { SearchCategory, SearchItem } from "./items";
import { SearchGroupList } from "./search-group-list";
import { useSearch } from "./use-search";

const HEADINGS: Record<SearchCategory, () => string> = {
  career: ui_search_group_career,
  page: ui_search_group_pages,
  skill: ui_search_group_skills,
};

export default function AppSearch() {
  const { value: isOpen, toggle, setFalse: close } = useBoolean(false);
  const { query, setQuery, groups } = useSearch();
  const navigate = useNavigate();

  useHotkeys(getHotkeyCombo("search"), toggle);

  const handleOpenChange = (nextIsOpen: boolean) => {
    if (!nextIsOpen) {
      close();
      setQuery("");
    }
  };

  const handleSelect = (item: SearchItem) => {
    navigate({ to: item.path });
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
        description={ui_search_placeholder()}
        onOpenChange={handleOpenChange}
        open={isOpen}
        shouldFilter={false}
        title={ui_search_title()}
      >
        <CommandInput
          onValueChange={setQuery}
          placeholder={ui_search_placeholder()}
          value={query}
        />
        <CommandList>
          {groups.length === 0 && (
            <CommandEmpty>{ui_search_empty()}</CommandEmpty>
          )}

          {groups.map((group, index) => (
            <Fragment key={group.category}>
              {index > 0 && <CommandSeparator />}
              <SearchGroupList
                heading={HEADINGS[group.category]()}
                items={group.items}
                onSelect={handleSelect}
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
