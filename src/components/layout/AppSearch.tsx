import ButtonWithTooltip from "@/components/common/ButtonWithTooltip.tsx";
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
import {useKeyboardShortcut} from "@/hooks/useKeyboard.ts";
import {Calculator, Calendar, CreditCard, Search, Settings, Smile, User,} from "lucide-react";
import * as React from "react";

export default function AppSearch() {
  const [open, setOpen] = React.useState(false);

  useKeyboardShortcut(
    "k",
    () => {
      setOpen((open) => !open);
    },
    {
      meta: true,
    },
  );

  return (
    <>
      <ButtonWithTooltip
        size="icon"
        variant="ghost"
        className="size-7 hover:bg-white/20 cursor-pointer"
        tooltip={
          <div className="flex items-center space-x-1">
            <span>Search</span>
            <span className="text-muted-foreground text-xs tracking-widest">
              ⌘K
            </span>
          </div>
        }
        onClick={() => {
          setOpen((open) => !open);
        }}
      >
        <Search className="text-white size-4" />
      </ButtonWithTooltip>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smile />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Calculator />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
