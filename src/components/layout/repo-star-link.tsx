import { useServerFn } from "@tanstack/react-start";
import { Star } from "lucide-react";
import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SITE_CONFIG } from "@/config/site";
import getRepoStarsFn from "@/fn/get-repo-stars.ts";
import { ui_settings_star_repo } from "@/paraglide/messages.js";

export default function RepoStarLink() {
  const getRepoStars = useServerFn(getRepoStarsFn);
  const stars = use(getRepoStars());

  const handleClick = () => {
    window.open(SITE_CONFIG.repository.url, "_blank", "noopener,noreferrer");
  };

  return (
    <DropdownMenuItem className="group font-mono" onClick={handleClick}>
      <span className="tracking-tight">{ui_settings_star_repo()}</span>
      <Badge
        className="ml-auto rounded-full tabular-nums transition-colors"
        variant="outline"
      >
        {stars || 0}
        <Star />
      </Badge>
    </DropdownMenuItem>
  );
}
