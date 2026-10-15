import { CommandGroup, CommandItem } from "@/components/ui/command";

import type { SearchItem } from "./items";

interface SearchGroupProps {
  heading: string;
  items: SearchItem[];
  onSelect: (item: SearchItem) => void;
}

export const SearchGroup = ({ heading, items, onSelect }: SearchGroupProps) => (
  <CommandGroup heading={heading}>
    {items.map((item) => (
      <CommandItem
        key={item.id}
        onSelect={() => onSelect(item)}
        value={item.id}
      >
        <span className="size-4">
          <item.icon />
        </span>
        <span>{item.title}</span>
        {item.description && (
          <span className="ml-auto text-muted-foreground text-xs">
            {item.description}
          </span>
        )}
      </CommandItem>
    ))}
  </CommandGroup>
);
