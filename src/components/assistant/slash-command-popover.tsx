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
import type { CommandItem as TCommandItem } from "@/hooks/use-assistant";
import { assistant_commands, assistant_empty } from "@/paraglide/messages.js";

interface SlashCommandPopoverProps {
  commandRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inputValue: string;
  commands: TCommandItem[];
  onCommandSelect: (command: TCommandItem) => void;
  children: ReactNode;
}

export default function SlashCommandPopover({
  commandRef,
  open,
  onOpenChange,
  inputValue,
  commands,
  onCommandSelect,
  children,
}: SlashCommandPopoverProps) {
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
            <CommandEmpty>{assistant_empty()}</CommandEmpty>
            <CommandGroup heading={assistant_commands()}>
              {commands.map((command) => {
                const Icon = command.icon;
                return (
                  <CommandItem
                    key={command.name}
                    keywords={[
                      command.name,
                      command.description,
                      ...(command.aliases ?? []),
                    ]}
                    onSelect={() => onCommandSelect(command)}
                    value={command.name}
                  >
                    <div className="flex items-start gap-3">
                      {!!Icon && (
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
