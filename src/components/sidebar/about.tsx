import { ABOUT_TREE, ABOUT_TREE_CONFIG } from "@/components/sidebar/page-trees";

import PageTree from "./page-tree";

export default function About() {
  return <PageTree config={ABOUT_TREE_CONFIG} treeData={ABOUT_TREE} />;
}
