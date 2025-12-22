import type { ItemInstance } from "@headless-tree/core";
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import type { PageTreeItem } from "@/config/page";

type TreeConfig = {
  rootItemId: string;
  defaultExpanded: readonly string[];
  indent: number;
};

type PageTreeProps = {
  treeData: Record<string, PageTreeItem>;
  config: TreeConfig;
  onItemSelect: (path: string) => void;
};

function getTreeItemIcon(item: ItemInstance<PageTreeItem>) {
  const iconClass = "pointer-events-none size-4 text-muted-foreground";
  if (!item.isFolder()) {
    return <FileIcon className={iconClass} />;
  }
  if (item.isExpanded()) {
    return <FolderOpenIcon className={iconClass} />;
  }
  return <FolderIcon className={iconClass} />;
}

export default function PageTree({
  treeData,
  config,
  onItemSelect,
}: PageTreeProps) {
  "use no memo";

  const tree = useTree<PageTreeItem>({
    initialState: {
      expandedItems: config.defaultExpanded as unknown as string[],
    },
    indent: config.indent,
    rootItemId: config.rootItemId,
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => treeData[itemId],
      getChildren: (itemId) => treeData[itemId].children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  });

  const handleItemDoubleClick = (item: ItemInstance<PageTreeItem>) => {
    const path = item.getItemData().path;
    if (path) {
      onItemSelect(path);
    }
  };

  return (
    <div className="flex h-full flex-col gap-2 overflow-auto *:first:grow">
      <div>
        <Tree
          className="before:-ms-1 relative before:absolute before:inset-0 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
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
