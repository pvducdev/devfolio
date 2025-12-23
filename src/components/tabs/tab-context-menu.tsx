import type { ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useTabContextMenu } from "@/hooks/use-tab-context-menu";
import {
  ui_tab_close,
  ui_tab_close_all,
  ui_tab_close_left,
  ui_tab_close_others,
  ui_tab_close_right,
  ui_tab_copy_path,
} from "@/paraglide/messages.js";

interface TabContextMenuProps {
  tabId: string;
  children: ReactNode;
}

export function TabContextMenu({ tabId, children }: TabContextMenuProps) {
  const { actions, visibility, shortcuts } = useTabContextMenu(tabId);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="min-w-52">
        <ContextMenuItem onSelect={actions.close}>
          {ui_tab_close()}
          <ContextMenuShortcut>{shortcuts.close}</ContextMenuShortcut>
        </ContextMenuItem>

        {visibility.closeOthers ? (
          <ContextMenuItem onSelect={actions.closeOthers}>
            {ui_tab_close_others()}
          </ContextMenuItem>
        ) : null}

        <ContextMenuItem onSelect={actions.closeAll}>
          {ui_tab_close_all()}
          <ContextMenuShortcut>{shortcuts.closeAll}</ContextMenuShortcut>
        </ContextMenuItem>

        {visibility.closeToRight ? (
          <ContextMenuItem onSelect={actions.closeToRight}>
            {ui_tab_close_right()}
          </ContextMenuItem>
        ) : null}

        {visibility.closeToLeft ? (
          <ContextMenuItem onSelect={actions.closeToLeft}>
            {ui_tab_close_left()}
          </ContextMenuItem>
        ) : null}

        <ContextMenuSeparator />

        <ContextMenuItem onSelect={actions.copyPath}>
          {ui_tab_copy_path()}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
