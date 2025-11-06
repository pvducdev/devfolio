import { useCallback, useEffect, useRef, useState } from "react";
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
import { filterCommands, type SlashCommand } from "@/config/slash-commands.ts";

/**
 * Props for SlashCommandPopover component
 */
type SlashCommandPopoverProps = {
  /** Whether the popover is open */
  open: boolean;
  /** Callback when popover open state changes */
  onOpenChange: (open: boolean) => void;
  /** Current input value for filtering commands */
  inputValue: string;
  /** Callback when a command is selected */
  onCommandSelect: (command: SlashCommand) => void;
  /**
   * Optional callback to register keyboard navigation handlers
   * Parent can use this to forward keyboard events to the popover
   * @param handler - Function to forward keyboard events (ArrowUp/ArrowDown)
   * @param getSelectedCommand - Function to retrieve currently selected command
   */
  onKeyboardNavigate?: (
    handler: (key: string) => void,
    getSelectedCommand: () => SlashCommand | null
  ) => void;
  /** Child element (typically the input field) to anchor the popover to */
  children: React.ReactNode;
};

/**
 * Popover component for displaying and selecting slash commands
 *
 * Features:
 * - Keyboard navigation with arrow keys
 * - Auto-selection of first item
 * - Command filtering based on input
 * - Auto-close when no matches found
 */
export default function SlashCommandPopover({
  open,
  onOpenChange,
  inputValue,
  onCommandSelect,
  onKeyboardNavigate,
  children,
}: SlashCommandPopoverProps) {
  const filteredCommands = filterCommands(inputValue);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const [selectedValue, setSelectedValue] = useState("");

  /**
   * Handle command selection and close popover
   */
  const handleCommandSelect = (command: SlashCommand) => {
    onCommandSelect(command);
    onOpenChange(false);
  };

  /**
   * Get the currently selected command based on selectedValue state
   * Memoized to avoid recreating on every render
   */
  const getSelectedCommand = useCallback((): SlashCommand | null => {
    const command = filteredCommands.find((cmd) => cmd.name === selectedValue);
    return command || null;
  }, [filteredCommands, selectedValue]);

  /**
   * Forward keyboard events from parent to Command component
   *
   * This enables the parent input to control arrow key navigation
   * by dispatching synthetic keyboard events to the Command component.
   *
   * Note: This relies on the Command component's internal keyboard handling.
   * If the UI library changes, this approach may need adjustment.
   */
  useEffect(() => {
    if (!onKeyboardNavigate) {
      return;
    }

    const handler = (key: string) => {
      commandInputRef.current?.dispatchEvent(
        new KeyboardEvent("keydown", {
          key,
          bubbles: true,
          cancelable: true,
        })
      );
    };

    onKeyboardNavigate(handler, getSelectedCommand);
  }, [onKeyboardNavigate, getSelectedCommand]);

  /**
   * Reset selection when popover closes or pre-select first item when opening
   * Ensures keyboard navigation always starts from first item
   */
  useEffect(() => {
    if (!open) {
      setSelectedValue("");
    } else if (filteredCommands.length > 0) {
      setSelectedValue(filteredCommands[0].name);
    }
  }, [open, filteredCommands]);

  /**
   * Auto-close popover when no commands match the input
   * Provides better UX by dismissing empty popover automatically
   */
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
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onOpenAutoFocus={(e) => e.preventDefault()}
        side="top"
        sideOffset={8}
      >
        <Command onValueChange={setSelectedValue} value={selectedValue}>
          <CommandInput className="sr-only" ref={commandInputRef} />
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
