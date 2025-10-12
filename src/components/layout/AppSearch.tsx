import {
  Calculator,
  Calendar,
  CreditCard,
  Search,
  Settings,
  Smile,
  User,
} from "lucide-react";
import * as React from "react";
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
import { useKeyboardShortcut } from "@/hooks/useKeyboard.ts";

export default function AppSearch() {
  const [open, setOpen] = React.useState(false);

  useKeyboardShortcut(
    "k",
    () => {
      setOpen((o) => !o);
    },
    {
      meta: true,
    }
  );

  return (
    <>
      <ButtonWithTooltip
        className="size-7 cursor-pointer hover:bg-white/20"
        onClick={() => {
          setOpen((o) => !o);
        }}
        size="icon"
        tooltip={
          <div className="flex items-center space-x-1">
            <span>Search</span>
            <span className="text-muted-foreground text-xs tracking-widest">
              ⌘K
            </span>
          </div>
        }
        variant="ghost"
      >
        <Search className="size-4 text-white" />
      </ButtonWithTooltip>
      <CommandDialog onOpenChange={setOpen} open={open}>
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
