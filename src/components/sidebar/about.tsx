import { useNavigate } from "@tanstack/react-router";
import PageTree from "@/components/sidebar/page-tree.tsx";
import { ABOUT_TREE, ABOUT_TREE_CONFIG } from "@/config/page";

export default function About() {
  const navigate = useNavigate();

  return (
    <PageTree
      config={ABOUT_TREE_CONFIG}
      onItemSelect={(path) => navigate({ to: path })}
      treeData={ABOUT_TREE}
    />
  );
}
