import type { ReactElement } from "react";

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

type TabContextMenuProps = ContextMenuTriggerProps & {
  tabId: string;
};

type ContextMenuTriggerProps = Parameters<typeof ContextMenuTrigger>[0];

export const TabContextMenu = ({
  tabId,
  children,
  ...triggerProps
}: TabContextMenuProps) => {
  const { actions, visibility, shortcuts } = useTabContextMenu(tabId);

  return (
    <ContextMenu>
      <ContextMenuTrigger render={children as ReactElement} {...triggerProps} />
      <ContextMenuContent className="min-w-52 rounded-lg">
        <ContextMenuItem onClick={actions.close}>
          {ui_tab_close()}
          <ContextMenuShortcut>{shortcuts.close}</ContextMenuShortcut>
        </ContextMenuItem>

        {visibility.closeOthers ? (
          <ContextMenuItem onClick={actions.closeOthers}>
            {ui_tab_close_others()}
          </ContextMenuItem>
        ) : null}

        <ContextMenuItem onClick={actions.closeAll}>
          {ui_tab_close_all()}
          <ContextMenuShortcut>{shortcuts.closeAll}</ContextMenuShortcut>
        </ContextMenuItem>

        {visibility.closeToRight ? (
          <ContextMenuItem onClick={actions.closeToRight}>
            {ui_tab_close_right()}
          </ContextMenuItem>
        ) : null}

        {visibility.closeToLeft ? (
          <ContextMenuItem onClick={actions.closeToLeft}>
            {ui_tab_close_left()}
          </ContextMenuItem>
        ) : null}

        <ContextMenuSeparator />

        <ContextMenuItem onClick={actions.copyPath}>
          {ui_tab_copy_path()}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
