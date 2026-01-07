import { Star } from "lucide-react";
import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SITE_CONFIG } from "@/config/site";
import { ui_settings_star_repo } from "@/paraglide/messages.js";

interface RepoStarLinkProps {
  starPromise: Promise<number | null>;
}

export default function RepoStarLink({ starPromise }: RepoStarLinkProps) {
  const stars = use(starPromise);

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
