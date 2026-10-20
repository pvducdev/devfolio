import { Star } from "lucide-react";

import { useRepoStars } from "@/components/layout/use-repo-stars";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SITE_CONFIG } from "@/config/site";
import { ui_settings_star_repo } from "@/paraglide/messages.js";

const handleClick = () => {
  window.open(SITE_CONFIG.repository.url, "_blank", "noopener,noreferrer");
};

export default function RepoStarLink() {
  const stars = useRepoStars();

  return (
    <DropdownMenuItem className="group" onClick={handleClick}>
      <span>{ui_settings_star_repo()}</span>
      {stars !== null && (
        <Badge
          className="ml-auto rounded-full border-none tabular-nums transition-colors group-hover:text-accent-foreground"
          variant="outline"
        >
          <AnimatedNumber value={stars} />
          <Star />
        </Badge>
      )}
    </DropdownMenuItem>
  );
}
