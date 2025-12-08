import {
  Calculator,
  Calendar,
  CreditCard,
  Search,
  Settings,
  Smile,
  User,
} from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { useBoolean } from "usehooks-ts";
import ButtonWithTooltip from "@/components/common/button-with-tooltip.tsx";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command.tsx";
import { Kbd, KbdGroup } from "@/components/ui/kbd.tsx";
import {
  ui_billing,
  ui_calculator,
  ui_calendar,
  ui_no_results,
  ui_profile,
  ui_search,
  ui_search_emoji,
  ui_search_placeholder,
  ui_settings,
  ui_suggestions,
} from "@/paraglide/messages.js";

export default function AppSearch() {
  const { value: open, toggle, setValue: setOpen } = useBoolean(false);

  useHotkeys("mod+k", toggle);

  return (
    <>
      <ButtonWithTooltip
        className="size-7"
        onClick={toggle}
        size="icon"
        tooltip={
          <div className="flex items-center space-x-2">
            <span>{ui_search()}</span>
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
      <CommandDialog onOpenChange={setOpen} open={open}>
        <CommandInput placeholder={ui_search_placeholder()} />
        <CommandList>
          <CommandEmpty>{ui_no_results()}</CommandEmpty>
          <CommandGroup heading={ui_suggestions()}>
            <CommandItem>
              <Calendar />
              <span>{ui_calendar()}</span>
            </CommandItem>
            <CommandItem>
              <Smile />
              <span>{ui_search_emoji()}</span>
            </CommandItem>
            <CommandItem>
              <Calculator />
              <span>{ui_calculator()}</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={ui_settings()}>
            <CommandItem>
              <User />
              <span>{ui_profile()}</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard />
              <span>{ui_billing()}</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings />
              <span>{ui_settings()}</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
