import type { ItemInstance } from "@headless-tree/core";
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import {
  PROJECT_TREE,
  PROJECT_TREE_CONFIG,
  type ProjectTreeItem,
} from "@/config/content.ts";
import { useTabsStore } from "@/store/tabs";

function getTreeItemIcon(item: ItemInstance<ProjectTreeItem>) {
  const iconClass = "pointer-events-none size-4 text-muted-foreground";
  if (!item.isFolder()) {
    return <FileIcon className={iconClass} />;
  }
  if (item.isExpanded()) {
    return <FolderOpenIcon className={iconClass} />;
  }
  return <FolderIcon className={iconClass} />;
}

export default function Projects() {
  "use no memo";

  const openTab = useTabsStore((state) => state.openTab);

  const tree = useTree<ProjectTreeItem>({
    initialState: {
      expandedItems: PROJECT_TREE_CONFIG.defaultExpanded as unknown as string[],
    },
    indent: PROJECT_TREE_CONFIG.indent,
    rootItemId: PROJECT_TREE_CONFIG.rootItemId,
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => PROJECT_TREE[itemId],
      getChildren: (itemId) => PROJECT_TREE[itemId].children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  });

  const handleItemDoubleClick = (item: ItemInstance<ProjectTreeItem>) => {
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
          indent={PROJECT_TREE_CONFIG.indent}
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
                  {getTreeItemIcon(item)}
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
