import { Gitlab } from "@/components/ui/svgs/gitlab";
import { Linkedin } from "@/components/ui/svgs/linkedin";

import { Badge } from "../ui/badge";

export default function StatusFooter() {
  return (
    <footer className="flex h-6 w-full items-center justify-between border-t bg-gray-100 px-3">
      <small className="text-muted-foreground text-xs leading-none">
        Home &gt; Welcome
      </small>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Gitlab className="size-3 text-muted-foreground [&>path]:fill-current" />
          <Linkedin className="size-3 text-muted-foreground [&>path]:fill-current" />
        </div>
        <small className="text-muted-foreground text-xs leading-none">
          TPHCM, Vietnam
        </small>
        <Badge
          className="rounded-full border-green-500 text-green-500"
          variant="outline"
        >
          Open to work
        </Badge>
      </div>
    </footer>
  );
}
