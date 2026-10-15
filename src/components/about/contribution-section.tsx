import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CONTRIBUTIONS_CONFIG } from "@/config/contributions";
import { page_about_contribution_error } from "@/paraglide/messages.js";
import { getLocale } from "@/paraglide/runtime.js";

import { buildContributionCalendar } from "./contribution-calendar";
import ContributionCell from "./contribution-cell";
import * as ContributionGraph from "./contribution-graph";
import { CONTRIBUTION_LEVELS } from "./contribution-levels";
import { ContributionSectionSkeleton } from "./contribution-section-skeleton";
import {
  formatContributionSummary,
  formatLevelLabel,
  formatMonth,
  formatWeekday,
} from "./format";
import { useContributions } from "./use-contributions";

const VISIBLE_WEEKDAYS = new Set([1, 3, 5]);

const ContributionSection = () => {
  const contributions = useContributions();

  const { weeks, months, weekdays } = buildContributionCalendar();
  const locale = getLocale();

  if (contributions.status === "loading") {
    return <ContributionSectionSkeleton />;
  }

  if (contributions.status === "error") {
    return (
      <section aria-label="contributions" className="mx-auto w-full p-4">
        <p className="text-center text-muted-foreground text-sm">
          {page_about_contribution_error({
            platform: CONTRIBUTIONS_CONFIG.source,
          })}
        </p>
      </section>
    );
  }

  return (
    <section aria-label="contributions" className="mx-auto w-full p-4">
      <ContributionGraph.Root data={contributions.data}>
        <ContributionGraph.Grid>
          <thead>
            <tr>
              <ContributionGraph.HeaderCell className="pr-2" />
              {months.map((month) => (
                <ContributionGraph.HeaderCell
                  colSpan={month.colSpan}
                  key={`${month.year}-${month.month}`}
                >
                  <ContributionGraph.Label>
                    {formatMonth(month.month, locale)}
                  </ContributionGraph.Label>
                </ContributionGraph.HeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {weekdays.map((day, rowIndex) => (
              <tr key={day}>
                <ContributionGraph.HeaderCell className="pr-2 text-right">
                  {VISIBLE_WEEKDAYS.has(day) && (
                    <ContributionGraph.Label>
                      {formatWeekday(day, locale)}
                    </ContributionGraph.Label>
                  )}
                </ContributionGraph.HeaderCell>
                {weeks.map((week, weekIndex) => {
                  const date = week[rowIndex];
                  return date ? (
                    <ContributionCell date={date} key={date} locale={locale} />
                  ) : (
                    <td key={`empty-${weekIndex}-${day}`} />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </ContributionGraph.Grid>
        <ContributionGraph.Legend className="justify-between">
          <p className="text-left text-sm">
            {formatContributionSummary(contributions.data)}
          </p>
          <div className="flex items-center space-x-0.5">
            {CONTRIBUTION_LEVELS.map((level, index) => (
              <Tooltip key={level.min}>
                <TooltipTrigger
                  render={<ContributionGraph.LegendItem level={index} />}
                />
                <TooltipContent>{formatLevelLabel(level)}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </ContributionGraph.Legend>
      </ContributionGraph.Root>
    </section>
  );
};

export default ContributionSection;
