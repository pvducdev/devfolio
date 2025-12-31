import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { HOTKEY_GROUPS, type HotkeyId } from "@/config/hotkeys";
import { getDisplayKeys } from "@/lib/hotkeys";
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

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HOTKEY_LABELS: Record<HotkeyId, () => string> = {
  search: ui_shortcuts_open_search,
  assistant: ui_shortcuts_toggle_assistant,
  toggleLayout: ui_shortcuts_toggle_layout,
  showShortcuts: ui_shortcuts_show_hotkeys,
  closeTab: ui_shortcuts_close_tab,
  closeAllTabs: ui_shortcuts_close_all_tabs,
};

const GROUP_LABELS = {
  general: ui_shortcuts_general,
  tabs: ui_shortcuts_tabs,
} as const;

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
          {(
            Object.keys(HOTKEY_GROUPS) as Array<keyof typeof HOTKEY_GROUPS>
          ).map((groupId) => (
            <div key={groupId}>
              <h4 className="mb-2 font-medium text-muted-foreground text-xs">
                {GROUP_LABELS[groupId]()}
              </h4>
              <div className="space-y-2">
                {HOTKEY_GROUPS[groupId].map((hotkeyId) => (
                  <div
                    className="flex items-center justify-between"
                    key={hotkeyId}
                  >
                    <span className="text-sm">{HOTKEY_LABELS[hotkeyId]()}</span>
                    <KbdGroup>
                      {getDisplayKeys(hotkeyId).map((key) => (
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
