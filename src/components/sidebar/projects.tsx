import { PROJECT_TREE, PROJECT_TREE_CONFIG } from "@/config/page";

import PageTree from "./page-tree";

export default function Projects() {
  return <PageTree config={PROJECT_TREE_CONFIG} treeData={PROJECT_TREE} />;
}
