const COMMAND_ITEM_SELECTOR = '[cmdk-item=""][aria-selected="true"]';

export function selectHighlightedCommand(commandRef: HTMLDivElement | null) {
  const highlightedElement = commandRef?.querySelector(COMMAND_ITEM_SELECTOR);
  if (!highlightedElement) {
    return;
  }

  const selectEvent = new Event("cmdk-item-select");
  highlightedElement.dispatchEvent(selectEvent);
}
