import type { ItemInstance } from "@headless-tree/core";
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import { ABOUT_TREE, ABOUT_TREE_CONFIG } from "@/config/content.ts";
import { useTabsStore } from "@/store/tabs";

type Item = {
  name: string;
  children?: string[];
  filePath?: string;
};

export default function About() {
  "use no memo";

  const openTab = useTabsStore(useShallow((state) => state.openTab));

  const tree = useTree<Item>({
    initialState: {
      expandedItems: ABOUT_TREE_CONFIG.defaultExpanded as unknown as string[],
    },
    indent: ABOUT_TREE_CONFIG.indent,
    rootItemId: ABOUT_TREE_CONFIG.rootItemId,
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => ABOUT_TREE[itemId],
      getChildren: (itemId) => ABOUT_TREE[itemId].children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  });

  const handleItemDoubleClick = (item: ItemInstance<Item>) => {
    const itemData = item.getItemData();

    if (itemData.filePath) {
      openTab(itemData.filePath);
    }
  };

  return (
    <div className="flex h-full flex-col gap-2 overflow-auto *:first:grow">
      <div>
        <Tree
          className="before:-ms-1 relative before:absolute before:inset-0 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
          indent={ABOUT_TREE_CONFIG.indent}
          tree={tree}
        >
          {tree.getItems().map((item) => (
            <TreeItem
              item={item}
              key={item.getId()}
              onDoubleClick={() => {
                handleItemDoubleClick(item);
              }}
            >
              <TreeItemLabel className="before:-inset-y-0.5 before:-z-10 relative before:absolute before:inset-x-0 before:bg-background">
                <span className="flex items-center gap-2 text-nowrap">
                  {item.isFolder() ? (
                    item.isExpanded() ? (
                      <FolderOpenIcon className="pointer-events-none size-4 text-muted-foreground" />
                    ) : (
                      <FolderIcon className="pointer-events-none size-4 text-muted-foreground" />
                    )
                  ) : (
                    <FileIcon className="pointer-events-none size-4 text-muted-foreground" />
                  )}
                  {item.getItemName()}
                </span>
              </TreeItemLabel>
            </TreeItem>
          ))}
        </Tree>
      </div>
    </div>
  );
}
