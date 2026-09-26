import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { page_about_contribution_tooltip } from "@/paraglide/messages.js";

import * as ContributionGraph from "./contribution-graph";
import { formatDateShort } from "./format";

interface ContributionCellProps {
  date: string;
  locale: string;
}

export default function ContributionCell({
  date,
  locale,
}: ContributionCellProps) {
  const count = ContributionGraph.useContributionCount(date);

  return (
    <Tooltip>
      <TooltipTrigger render={<ContributionGraph.Cell date={date} />} />
      <TooltipContent>
        {page_about_contribution_tooltip({
          count,
          date: formatDateShort(date, locale),
        })}
      </TooltipContent>
    </Tooltip>
  );
}
