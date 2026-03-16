import {
  mobile_projects_hint,
  mobile_projects_listing_count,
} from "@/paraglide/messages";

interface ListingHeaderProps {
  count: number;
}

export default function ListingHeader({ count }: ListingHeaderProps) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-muted-foreground text-xs">
        {mobile_projects_listing_count({ count })}
      </p>
      <p className="font-mono text-muted-foreground/50 text-xs">
        {mobile_projects_hint()}
      </p>
    </div>
  );
}
