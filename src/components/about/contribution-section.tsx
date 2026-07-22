import ContributionCell from "@/components/about/contribution-cell";
import { ContributionSectionSkeleton } from "@/components/about/contribution-section-skeleton";
import * as ContributionGraph from "@/components/common/contribution-graph";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CONTRIBUTIONS_CONFIG } from "@/config/contributions";
import { useContributions } from "@/hooks/use-contributions";
import { useContributionGraph } from "@/hooks/use-contributions-graph";
import type { ContributionData } from "@/lib/contributions/types";
import { formatMonth, formatWeekday } from "@/lib/date";
import {
  page_about_contribution_level_more,
  page_about_contribution_level_none,
  page_about_contribution_level_range,
  page_about_contribution_summary,
} from "@/paraglide/messages.js";
import { getLocale } from "@/paraglide/runtime.js";

interface LevelThreshold {
  min: number;
  max?: number;
}

const DEFAULT_THRESHOLDS: LevelThreshold[] = [
  { max: 0, min: 0 },
  { max: 2, min: 1 },
  { max: 5, min: 3 },
  { max: 9, min: 6 },
  { min: 10 },
];

const formatLevelLabel = (threshold: LevelThreshold): string => {
  if (threshold.min === 0 && threshold.max === 0) {
    return page_about_contribution_level_none();
  }

  if (threshold.max === undefined) {
    return page_about_contribution_level_more({ min: threshold.min });
  }

  return page_about_contribution_level_range({
    max: threshold.max,
    min: threshold.min,
  });
};

const formatSummary = (count: number): string =>
  page_about_contribution_summary({
    count,
    platform: CONTRIBUTIONS_CONFIG.source,
  });

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

const ContributionSection = () => {
  const { data, isLoading, status } = useContributions();

  const { weeks, months, weekdays, startDate, endDate } = useContributionGraph({
    weekStartDay: 0,
  });
  const locale = getLocale();
  const visibleWeekdays = new Set([1, 3, 5]);

  const totalContributions = data.reduce(
    (sum, item: ContributionData) => sum + item.count,
    0
  );

  if (isLoading) {
    return <ContributionSectionSkeleton />;
  }

  if (status === "error") {
    return (
      <section aria-label="contributions" className="mx-auto w-full p-4">
        <p className="text-center text-muted-foreground text-sm">
          {page_about_contribution_summary({
            count: 0,
            platform: CONTRIBUTIONS_CONFIG.source,
          })}
        </p>
      </section>
    );
  }

  return (
    <section aria-label="contributions" className="mx-auto w-full p-4">
      <ContributionGraph.Root
        data={data}
        endDate={endDate}
        levelThresholds={getLevelForCount}
        startDate={startDate}
      >
        <ContributionGraph.Grid>
          <ContributionGraph.Head>
            <ContributionGraph.Row>
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
            </ContributionGraph.Row>
          </ContributionGraph.Head>
          <ContributionGraph.Body>
            {weekdays.map((day, rowIndex) => (
              <ContributionGraph.Row key={day}>
                <ContributionGraph.HeaderCell className="pr-2 text-right">
                  {visibleWeekdays.has(day) && (
                    <ContributionGraph.Label>
                      {formatWeekday(day, locale)}
                    </ContributionGraph.Label>
                  )}
                </ContributionGraph.HeaderCell>
                {weeks.map((week, weekIndex) => {
                  const date = week[rowIndex];
                  if (!date) {
                    return (
                      <ContributionGraph.Cell
                        date={date}
                        key={`empty-${weekIndex}-${day}`}
                      />
                    );
                  }
                  return (
                    <ContributionCell date={date} key={date} locale={locale} />
                  );
                })}
              </ContributionGraph.Row>
            ))}
          </ContributionGraph.Body>
        </ContributionGraph.Grid>
        <ContributionGraph.Legend className="justify-between">
          <p className="text-left text-sm">
            {formatSummary(totalContributions)}
          </p>
          <div className="flex items-center space-x-0.5">
            {DEFAULT_THRESHOLDS.map((threshold, idx) => (
              <Tooltip key={threshold.min}>
                <TooltipTrigger
                  render={
                    <ContributionGraph.LegendItem
                      level={idx as 0 | 1 | 2 | 3 | 4}
                    />
                  }
                />
                <TooltipContent>{formatLevelLabel(threshold)}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </ContributionGraph.Legend>
      </ContributionGraph.Root>
    </section>
  );
};

export default ContributionSection;
