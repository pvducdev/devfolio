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
import { registry } from "@/lib/commands";
import "@/commands";
import type { Command as TCommand } from "@/lib/commands/types";

type SlashCommandPopoverProps = {
  commandRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inputValue: string;
  onCommandSelect: (command: TCommand) => void;
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
  // Get commands from registry
  const commands = registry.list();

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
              {commands.map((command) => {
                const Icon = command.icon;
                return (
                  <CommandItem
                    key={command.name}
                    keywords={[command.name, command.description]}
                    onSelect={() => onCommandSelect(command)}
                    value={command.name}
                  >
                    <div className="flex items-start gap-3">
                      {Icon && (
                        <Icon className="mt-0.5 size-4 text-muted-foreground" />
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">/{command.name}</span>
                        <span className="text-muted-foreground text-xs">
                          {command.description}
                        </span>
                      </div>
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
