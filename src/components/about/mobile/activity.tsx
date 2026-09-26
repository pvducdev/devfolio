import { Skeleton } from "@/components/ui/skeleton";
import { CONTRIBUTIONS_CONFIG } from "@/config/contributions";
import {
  mobile_about_activity_label,
  mobile_about_activity_loading,
  page_about_contribution_error,
} from "@/paraglide/messages";
import { getLocale } from "@/paraglide/runtime";

import { buildContributionCalendar } from "../contribution-calendar";
import * as ContributionGraph from "../contribution-graph";
import { CONTRIBUTION_LEVELS } from "../contribution-levels";
import {
  formatContributionSummary,
  formatMonth,
  formatWeekday,
} from "../format";
import { useContributions } from "../use-contributions";

const VISIBLE_WEEKDAYS = new Set([1, 3, 5]);

const AboutActivity = () => {
  const contributions = useContributions();

  const { weeks, months, weekdays } = buildContributionCalendar();

  const locale = getLocale();

  return (
    <div className="mt-6">
      <p className="text-muted-foreground text-xs">
        {mobile_about_activity_label()}
      </p>
      <p className="text-muted-foreground text-xs">
        -----------------------------
      </p>

      {contributions.status === "loading" && (
        <div className="mt-2 space-y-2">
          <p className="animate-pulse text-muted-foreground text-xs">
            {mobile_about_activity_loading()}
          </p>
          <Skeleton className="h-20 w-full" />
        </div>
      )}
      {contributions.status === "error" && (
        <p className="mt-2 text-muted-foreground text-xs">
          {page_about_contribution_error({
            platform: CONTRIBUTIONS_CONFIG.source,
          })}
        </p>
      )}
      {contributions.status === "success" && (
        <ContributionGraph.Root
          className="mt-3 min-w-0 overflow-visible text-[10px]"
          data={contributions.data}
        >
          <div className="overflow-x-auto">
            <ContributionGraph.Grid className="min-w-max border-separate border-spacing-0.5">
              <thead>
                <tr>
                  <ContributionGraph.HeaderCell />
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
                    <ContributionGraph.HeaderCell className="pr-1 text-right">
                      {VISIBLE_WEEKDAYS.has(day) && (
                        <ContributionGraph.Label>
                          {formatWeekday(day, locale)}
                        </ContributionGraph.Label>
                      )}
                    </ContributionGraph.HeaderCell>
                    {weeks.map((week, weekIndex) => {
                      const date = week[rowIndex];
                      return (
                        <ContributionGraph.Cell
                          className="size-2 rounded-xs"
                          date={date}
                          key={date || `empty-${weekIndex}-${day}`}
                        />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </ContributionGraph.Grid>
          </div>

          <ContributionGraph.Legend className="mt-2 justify-between">
            <p className="text-muted-foreground text-xs">
              {formatContributionSummary(contributions.data)}
            </p>
            <div className="flex items-center gap-0.5">
              {CONTRIBUTION_LEVELS.map((threshold, level) => (
                <ContributionGraph.LegendItem
                  key={threshold.min}
                  level={level}
                />
              ))}
            </div>
          </ContributionGraph.Legend>
        </ContributionGraph.Root>
      )}
    </div>
  );
};

export default AboutActivity;
