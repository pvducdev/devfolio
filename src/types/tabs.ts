export type Tab = {
  id: string;
  filePath: string;
  label: string;
};

export type TabsState = {
  tabs: Tab[];
  activeTabId: string | null;
};

export type TabsActions = {
  openTab: (filePath: string) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
};
