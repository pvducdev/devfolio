import { Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";

const THEMES = ["bubblegum", "mocha-mousse"];

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const body = document.querySelector("body");
    if (body) {
      body.setAttribute("data-theme", value);
    }
  }, [value]);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className="h-[22px] px-1.5 py-px text-center text-xs"
          role="combobox"
          variant="ghost"
        >
          <Palette className="size-4" />
          {value ? THEMES.find((theme) => theme === value) : "Select theme..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {THEMES.map((theme) => (
                <CommandItem
                  key={theme}
                  onSelect={(v) => {
                    setValue(v);
                    setOpen(false);
                  }}
                  value={theme}
                >
                  {theme}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
