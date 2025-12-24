import { Search } from "lucide-react";
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
import { useSearch } from "@/lib/search/hooks/use-search";
import { useSearchActions } from "@/lib/search/hooks/use-search-actions";
import {
  ui_search_empty,
  ui_search_group_commands,
  ui_search_group_content,
  ui_search_group_pages,
  ui_search_hint_close,
  ui_search_hint_navigate,
  ui_search_hint_select,
  ui_search_placeholder,
  ui_search_title,
} from "@/paraglide/messages.js";

export default function AppSearch() {
  const { value: open, toggle, setFalse: close } = useBoolean(false);
  const { query, setQuery, results, hasResults, clearQuery } = useSearch();
  const { executeAction } = useSearchActions();

  useHotkeys("mod+k", toggle);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      close();
      clearQuery();
    }
  };

  const handleSelect = (item: Parameters<typeof executeAction>[0]) => {
    executeAction(item, () => {
      close();
      clearQuery();
    });
  };

  const showPagesSeparator =
    results.pages.length > 0 && results.commands.length > 0;
  const showCommandsSeparator =
    (results.pages.length > 0 || results.commands.length > 0) &&
    results.content.length > 0;

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
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
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

          <SearchGroup
            heading={ui_search_group_pages()}
            onSelect={handleSelect}
            results={results.pages}
          />

          {showPagesSeparator && <CommandSeparator />}

          <SearchGroup
            heading={ui_search_group_commands()}
            onSelect={handleSelect}
            results={results.commands}
          />

          {showCommandsSeparator && <CommandSeparator />}

          <SearchGroup
            heading={ui_search_group_content()}
            onSelect={handleSelect}
            results={results.content}
          />
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
