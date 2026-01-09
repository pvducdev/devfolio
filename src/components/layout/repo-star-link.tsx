import { Star } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number.tsx";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SITE_CONFIG } from "@/config/site";
import { useRepoStars } from "@/hooks/use-repo-stars";
import { ui_settings_star_repo } from "@/paraglide/messages.js";

export default function RepoStarLink() {
  const stars = useRepoStars();

  const handleClick = () => {
    window.open(SITE_CONFIG.repository.url, "_blank", "noopener,noreferrer");
  };

  return (
    <DropdownMenuItem className="group" onClick={handleClick}>
      <span>{ui_settings_star_repo()}</span>
      <Badge
        className="ml-auto rounded-full border-none tabular-nums transition-colors group-hover:text-accent-foreground"
        variant="outline"
      >
        <AnimatedNumber value={stars} />
        <Star />
      </Badge>
    </DropdownMenuItem>
  );
}
