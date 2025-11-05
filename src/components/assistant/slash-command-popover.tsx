import { useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover.tsx";
import { filterCommands, type SlashCommand } from "@/config/slash-commands.ts";

type SlashCommandPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inputValue: string;
  onCommandSelect: (command: SlashCommand) => void;
  children: React.ReactNode;
};

export default function SlashCommandPopover({
  open,
  onOpenChange,
  inputValue,
  onCommandSelect,
  children,
}: SlashCommandPopoverProps) {
  const filteredCommands = filterCommands(inputValue);

  const handleCommandSelect = (command: SlashCommand) => {
    onCommandSelect(command);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open && filteredCommands.length === 0 && inputValue.startsWith("/")) {
      onOpenChange(false);
    }
  }, [open, filteredCommands.length, inputValue, onOpenChange]);

  return (
    <Popover onOpenChange={onOpenChange} open={open}>
      <PopoverAnchor asChild>{children}</PopoverAnchor>
      <PopoverContent
        align="start"
        className="w-[300px] p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        side="top"
        sideOffset={8}
      >
        <Command>
          <CommandList>
            <CommandEmpty>No commands found.</CommandEmpty>
            <CommandGroup heading="Commands">
              {filteredCommands.map((command) => {
                const Icon = command.icon;
                return (
                  <CommandItem
                    key={command.name}
                    onSelect={() => handleCommandSelect(command)}
                    value={command.name}
                  >
                    {Icon && <Icon className="mr-2 size-4" />}
                    <div className="flex flex-col">
                      <span className="font-medium">/{command.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {command.description}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
