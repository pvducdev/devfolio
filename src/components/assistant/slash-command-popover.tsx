import type { KeyboardEvent, RefObject } from "react";

import type { CommandItem as TCommandItem } from "@/components/assistant/use-assistant";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { assistant_commands, assistant_empty } from "@/paraglide/messages.js";

const FORWARDED_KEYS = new Set(["ArrowUp", "ArrowDown", "Enter", "Escape"]);
const HIGHLIGHTED_COMMAND = '[cmdk-item=""][aria-selected="true"]';

export const forwardKeyToCommandList = (
  event: KeyboardEvent<HTMLTextAreaElement>,
  commandList: HTMLDivElement | null
) => {
  if (event.key === "Tab") {
    event.preventDefault();
    commandList
      ?.querySelector(HIGHLIGHTED_COMMAND)
      ?.dispatchEvent(new Event("cmdk-item-select"));
    return;
  }

  if (FORWARDED_KEYS.has(event.key)) {
    event.preventDefault();
    commandList?.dispatchEvent(
      new globalThis.KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        code: event.code,
        key: event.key,
      })
    );
  }
};

interface SlashCommandPopoverProps {
  anchorRef: RefObject<HTMLElement | null>;
  commandRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inputValue: string;
  commands: TCommandItem[];
  onCommandSelect: (command: TCommandItem) => void;
}

export default function SlashCommandPopover({
  anchorRef,
  commandRef,
  open,
  onOpenChange,
  inputValue,
  commands,
  onCommandSelect,
}: SlashCommandPopoverProps) {
  return (
    <Popover onOpenChange={onOpenChange} open={open}>
      <PopoverContent
        align="start"
        anchor={anchorRef}
        className="max-h-[var(--available-height)] w-[var(--anchor-width)] p-0"
        initialFocus={false}
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
