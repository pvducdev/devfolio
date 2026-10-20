import { cn } from "cn";
import { Check, Palette } from "lucide-react";
import { useBoolean } from "usehooks-ts";

import { useCurrentTheme, useSetTheme } from "@/components/theme/store";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { THEMES } from "@/config/theme";

export default function ThemeSwitcher() {
  const { value: isOpen, setValue: setIsOpen } = useBoolean(false);
  const theme = useCurrentTheme();
  const setTheme = useSetTheme();

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger
        render={
          <Button
            aria-expanded={isOpen}
            className="h-[22px] px-1.5 py-px text-center text-muted-foreground text-xs"
            role="combobox"
            variant="ghost"
          >
            <Palette className="size-4" />
            {THEMES.find((t) => t.value === theme)?.name}
          </Button>
        }
      />
      <PopoverContent className="max-w-60 p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {THEMES.map((t) => (
                <CommandItem
                  key={t.value}
                  onSelect={() => {
                    setTheme(t.value);
                    setIsOpen(false);
                  }}
                  value={t.value}
                >
                  {t.name}
                  <Check
                    className={cn(
                      "ml-auto text-primary",
                      theme === t.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
