import { Gitlab } from "@/components/ui/svgs/gitlab";
import { Linkedin } from "@/components/ui/svgs/linkedin";

import { Badge } from "../ui/badge";

export default function StatusFooter() {
  return (
    <footer className="w-full h-6 border-t bg-gray-100 justify-between items-center flex px-3">
      <small className="text-xs leading-none text-muted-foreground">
        Home &gt; Welcome
      </small>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Gitlab className="size-3 text-muted-foreground [&>path]:fill-current" />
          <Linkedin className="size-3 text-muted-foreground [&>path]:fill-current" />
        </div>
        <small className="text-xs leading-none text-muted-foreground">
          TPHCM, Vietnam
        </small>
        <Badge
          className="text-green-500 border-green-500 rounded-full"
          variant="outline"
        >
          Open to work
        </Badge>
      </div>
    </footer>
  );
}
