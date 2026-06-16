import * as ContributionGraph from "@/components/common/contribution-graph";
import { Skeleton } from "@/components/ui/skeleton";
import { CONTRIBUTIONS_CONFIG } from "@/config/contributions";
import { useContributions } from "@/hooks/use-contributions";
import { useContributionGraph } from "@/hooks/use-contributions-graph";
import { formatMonth, formatWeekday } from "@/lib/date";
import {
  mobile_about_activity_label,
  mobile_about_activity_loading,
  page_about_contribution_summary,
} from "@/paraglide/messages";
import { getLocale } from "@/paraglide/runtime";

const VISIBLE_WEEKDAYS = new Set([1, 3, 5]);

const getLevelForCount = (count: number): number => {
  if (count === 0) {
    return 0;
  }
  if (count <= 2) {
    return 1;
  }
  if (count <= 5) {
    return 2;
  }
  if (count <= 9) {
    return 3;
  }
  return 4;
};

const AboutActivity = () => {
  const { data, isLoading } = useContributions();

  const { weeks, months, weekdays, startDate, endDate } = useContributionGraph({
    weekStartDay: 0,
  });

  const locale = getLocale();

  const totalContributions = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="mt-6">
      <p className="text-muted-foreground text-xs">
        {mobile_about_activity_label()}
      </p>
      <p className="text-muted-foreground text-xs">
        -----------------------------
      </p>

      {isLoading ? (
        <div className="mt-2 space-y-2">
          <p className="animate-pulse text-muted-foreground text-xs">
            {mobile_about_activity_loading()}
          </p>
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <ContributionGraph.Root
          className="mt-3 min-w-0 overflow-visible text-[10px]"
          data={data}
          endDate={endDate}
          levelThresholds={getLevelForCount}
          startDate={startDate}
        >
          <div className="overflow-x-auto">
            <ContributionGraph.Grid className="min-w-max border-separate border-spacing-0.5">
              <ContributionGraph.Head>
                <ContributionGraph.Row>
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
                </ContributionGraph.Row>
              </ContributionGraph.Head>
              <ContributionGraph.Body>
                {weekdays.map((day, rowIndex) => (
                  <ContributionGraph.Row key={day}>
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
                  </ContributionGraph.Row>
                ))}
              </ContributionGraph.Body>
            </ContributionGraph.Grid>
          </div>

          <ContributionGraph.Legend className="mt-2 justify-between">
            <p className="text-muted-foreground text-xs">
              {page_about_contribution_summary({
                count: String(totalContributions),
                platform: CONTRIBUTIONS_CONFIG.source,
              })}
            </p>
            <div className="flex items-center gap-0.5">
              {[0, 1, 2, 3, 4].map((level) => (
                <ContributionGraph.LegendItem
                  key={level}
                  level={level as 0 | 1 | 2 | 3 | 4}
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
