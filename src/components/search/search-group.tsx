import {
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import type { AppSearchItem } from "@/config/search";
import type { SearchResult } from "@/lib/search/core";

interface SearchGroupProps {
  heading: string;
  results: SearchResult<AppSearchItem>[];
  onSelect: (item: AppSearchItem) => void;
}

export function SearchGroup({ heading, results, onSelect }: SearchGroupProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <CommandGroup heading={heading}>
      {results.map(({ item }) => {
        const Icon = item.meta?.icon;
        return (
          <CommandItem
            key={item.id}
            onSelect={() => onSelect(item)}
            value={item.id}
          >
            {Icon && (
              <span className="size-4">
                <Icon />
              </span>
            )}
            <span>{item.title}</span>
            {item.description && (
              <span className="ml-auto text-muted-foreground text-xs">
                {item.description}
              </span>
            )}
            {item.meta?.shortcut && (
              <CommandShortcut>{item.meta.shortcut}</CommandShortcut>
            )}
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
}
