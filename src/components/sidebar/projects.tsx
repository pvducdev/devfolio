import { useNavigate } from "@tanstack/react-router";
import PageTree from "@/components/sidebar/page-tree.tsx";
import { PROJECT_TREE, PROJECT_TREE_CONFIG } from "@/config/page";

export default function Projects() {
  const navigate = useNavigate();

  return (
    <PageTree
      config={PROJECT_TREE_CONFIG}
      onItemSelect={(path) => navigate({ to: path })}
      treeData={PROJECT_TREE}
    />
  );
}
