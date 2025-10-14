import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";

import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";

type Item = {
  name: string;
  children?: string[];
};

const items: Record<string, Item> = {
  company: {
    name: "Company",
    children: ["engineering", "marketing"],
  },
  engineering: {
    name: "Engineering",
    children: ["frontend", "backend", "platform-team"],
  },
  frontend: { name: "Frontend", children: ["design-system", "web-platform"] },
  "design-system": {
    name: "Design System",
    children: ["components", "tokens", "guidelines"],
  },
  components: { name: "Components" },
  tokens: { name: "Tokens" },
  guidelines: { name: "Guidelines" },
  "web-platform": { name: "Web Platform" },
  backend: { name: "Backend", children: ["apis", "infrastructure"] },
  apis: { name: "APIs" },
  infrastructure: { name: "Infrastructure" },
  "platform-team": { name: "Platform Team" },
  marketing: { name: "Marketing", children: ["content", "seo"] },
  content: { name: "Content" },
  seo: { name: "SEO" },
};

const indent = 20;

export default function Projects() {
  const tree = useTree<Item>({
    initialState: {
      expandedItems: ["engineering", "frontend", "design-system"],
    },
    indent,
    rootItemId: "company",
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => items[itemId],
      getChildren: (itemId) => items[itemId].children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  });

  return (
    <div className="flex h-full flex-col gap-2 overflow-auto *:first:grow">
      <div>
        <Tree
          className="before:-ms-1 relative before:absolute before:inset-0 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
          indent={indent}
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
