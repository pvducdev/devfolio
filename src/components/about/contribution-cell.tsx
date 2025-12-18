import { useState } from "react";

import type { CellState } from "@/components/common/contribution-graph";
// biome-ignore lint/performance/noNamespaceImport: component pattern
import * as ContributionGraph from "@/components/common/contribution-graph";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDateShort } from "@/lib/date";
import { page_about_contribution_tooltip } from "@/paraglide/messages.js";

type ContributionCellProps = {
  date: string;
  locale: string;
};

export default function ContributionCell({
  date,
  locale,
}: ContributionCellProps) {
  const [cellState, setCellState] = useState<CellState | null>(null);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ContributionGraph.Cell
          date={date}
          onMouseEnter={setCellState}
          onMouseLeave={() => setCellState(null)}
        />
      </TooltipTrigger>
      <TooltipContent>
        {page_about_contribution_tooltip({
          count: cellState?.count ?? 0,
          date: formatDateShort(date, locale),
        })}
      </TooltipContent>
    </Tooltip>
  );
}
