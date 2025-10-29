import { Check, Palette } from "lucide-react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button.tsx";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { THEMES } from "@/config/theme.ts";
import { cn } from "@/lib/utils.ts";
import { useThemeStore } from "@/store/theme.ts";

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useThemeStore(
    useShallow((state) => [state.theme, state.setTheme])
  );

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className="h-[22px] px-1.5 py-px text-center text-muted-foreground text-xs"
          role="combobox"
          variant="ghost"
        >
          <Palette className="size-4" />
          {theme
            ? THEMES.find((t) => t.value === theme)?.name
            : "Select theme..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {THEMES.map((t) => (
                <CommandItem
                  key={t.value}
                  onSelect={(v) => {
                    setTheme(v);
                    setOpen(false);
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
