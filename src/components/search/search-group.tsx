import {
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import type { SearchItem, SearchResult } from "@/lib/search/types";

interface SearchGroupProps {
  heading: string;
  results: SearchResult[];
  onSelect: (item: SearchItem) => void;
}

export function SearchGroup({ heading, results, onSelect }: SearchGroupProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <CommandGroup heading={heading}>
      {results.map(({ item }) => (
        <CommandItem
          key={item.id}
          onSelect={() => onSelect(item)}
          value={item.id}
        >
          {item.icon && (
            <span className="size-4">
              <item.icon />
            </span>
          )}
          <span>{item.title}</span>
          {item.description && (
            <span className="ml-auto text-muted-foreground text-xs">
              {item.description}
            </span>
          )}
          {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
