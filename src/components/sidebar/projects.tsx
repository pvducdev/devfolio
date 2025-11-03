import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";

import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import { PROJECT_TREE_CONFIG } from "@/config/components.ts";
import { PROJECT_TREE } from "@/config/content.ts";

type Item = {
  name: string;
  children?: string[];
};

export default function Projects() {
  "use no memo";

  const tree = useTree<Item>({
    initialState: {
      expandedItems: PROJECT_TREE_CONFIG.defaultExpanded,
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

  return (
    <div className="flex h-full flex-col gap-2 overflow-auto *:first:grow">
      <div>
        <Tree
          className="before:-ms-1 relative before:absolute before:inset-0 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
          indent={PROJECT_TREE_CONFIG.indent}
          tree={tree}
        >
          {tree.getItems().map((item) => (
            <TreeItem item={item} key={item.getId()}>
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
