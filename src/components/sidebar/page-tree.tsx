import type { ItemInstance } from "@headless-tree/core";
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { useNavigate } from "@tanstack/react-router";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";

import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import type { PageTreeItem } from "@/config/page";

interface TreeConfig {
  rootItemId: string;
  defaultExpanded: readonly string[];
  indent: number;
}

interface PageTreeProps {
  treeData: Record<string, PageTreeItem>;
  config: TreeConfig;
}

const getTreeItemIcon = (item: ItemInstance<PageTreeItem>) => {
  const iconClass = "pointer-events-none size-4 text-muted-foreground";
  if (!item.isFolder()) {
    return <FileIcon className={iconClass} />;
  }
  if (item.isExpanded()) {
    return <FolderOpenIcon className={iconClass} />;
  }
  return <FolderIcon className={iconClass} />;
};

const PageTree = ({ treeData, config }: PageTreeProps) => {
  // headless-tree mutates its tree instance, so compiler memoization would render stale items
  "use no memo";
  const navigate = useNavigate();

  const tree = useTree<PageTreeItem>({
    dataLoader: {
      getChildren: (itemId) => treeData[itemId].children ?? [],
      getItem: (itemId) => treeData[itemId],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
    getItemName: (item) => item.getItemData().name,
    indent: config.indent,
    initialState: {
      expandedItems: [...config.defaultExpanded],
    },
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    rootItemId: config.rootItemId,
  });

  const handleItemDoubleClick = (item: ItemInstance<PageTreeItem>) => {
    const { path } = item.getItemData();
    if (path) {
      navigate({ to: path });
    }
  };

  return (
    <div className="flex h-full flex-col gap-2 overflow-auto *:first:grow">
      <div>
        <Tree
          className="relative before:absolute before:inset-0 before:-ms-1 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
          indent={config.indent}
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
              <TreeItemLabel className="relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10 before:bg-background hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
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
};

export default PageTree;
