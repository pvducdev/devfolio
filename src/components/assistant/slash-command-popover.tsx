import type { ReactNode, RefObject } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover.tsx";
import { SLASH_COMMANDS, type SlashCommand } from "@/config/slash-commands.ts";

type SlashCommandPopoverProps = {
  commandRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inputValue: string;
  onCommandSelect: (command: SlashCommand) => void;
  children: ReactNode;
};

export default function SlashCommandPopover({
  commandRef,
  open,
  onOpenChange,
  inputValue,
  onCommandSelect,
  children,
}: SlashCommandPopoverProps) {
  const handleCommandSelect = (command: SlashCommand) => {
    onCommandSelect(command);
    onOpenChange(false);
  };

  return (
    <Popover onOpenChange={onOpenChange} open={open}>
      <PopoverAnchor asChild>{children}</PopoverAnchor>
      <PopoverContent
        align="start"
        className="max-h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-trigger-width)] p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        side="top"
        sideOffset={8}
      >
        <Command>
          <div className="sr-only">
            <CommandInput value={inputValue} />
          </div>
          <CommandList ref={commandRef}>
            <CommandEmpty>No commands found.</CommandEmpty>
            <CommandGroup heading="Commands">
              {SLASH_COMMANDS.map((command) => {
                const Icon = command.icon;
                return (
                  <CommandItem
                    key={command.name}
                    keywords={[command.name, command.description]}
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
