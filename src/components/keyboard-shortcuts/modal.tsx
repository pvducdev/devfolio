import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  ui_settings_shortcuts,
  ui_shortcuts_close_all_tabs,
  ui_shortcuts_close_tab,
  ui_shortcuts_general,
  ui_shortcuts_open_search,
  ui_shortcuts_show_hotkeys,
  ui_shortcuts_tabs,
  ui_shortcuts_toggle_assistant,
  ui_shortcuts_toggle_layout,
} from "@/paraglide/messages.js";

interface ShortcutItem {
  keys: string[];
  action: string;
}

interface ShortcutGroup {
  label: string;
  items: ShortcutItem[];
}

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SHORTCUTS: ShortcutGroup[] = [
  {
    label: ui_shortcuts_general(),
    items: [
      { keys: ["⌘", "K"], action: ui_shortcuts_open_search() },
      { keys: ["⌘", "J"], action: ui_shortcuts_toggle_assistant() },
      { keys: ["⌘", "⇧", "F"], action: ui_shortcuts_toggle_layout() },
      { keys: ["⌘", "⌥", "K"], action: ui_shortcuts_show_hotkeys() },
    ],
  },
  {
    label: ui_shortcuts_tabs(),
    items: [
      { keys: ["⌥", "W"], action: ui_shortcuts_close_tab() },
      { keys: ["⌥", "⇧", "W"], action: ui_shortcuts_close_all_tabs() },
    ],
  },
];

export default function KeyboardShortcutsModal({
  open,
  onOpenChange,
}: KeyboardShortcutsModalProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{ui_settings_shortcuts()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {SHORTCUTS.map((group) => (
            <div key={group.label}>
              <h4 className="mb-2 font-medium text-muted-foreground text-xs">
                {group.label}
              </h4>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div
                    className="flex items-center justify-between"
                    key={item.action}
                  >
                    <span className="text-sm">{item.action}</span>
                    <KbdGroup>
                      {item.keys.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </KbdGroup>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
