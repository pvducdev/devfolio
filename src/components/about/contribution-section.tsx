import { Suspense, use, useMemo } from "react";

import { ContributionSectionSkeleton } from "@/components/about/contribution-section-skeleton";
// biome-ignore lint/performance/noNamespaceImport: component pattern
import * as ContributionGraph from "@/components/common/contribution-graph";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useContributionGraphDates } from "@/hooks/use-contributions";
import type { ContributionData } from "@/lib/contributions/types";
import {
  formatDateShort,
  formatMonth,
  formatWeekday,
  toISODateString,
} from "@/lib/utils";
import {
  page_about_contribution_level_more,
  page_about_contribution_level_none,
  page_about_contribution_level_range,
  page_about_contribution_summary,
  page_about_contribution_tooltip,
} from "@/paraglide/messages.js";
import { getLocale } from "@/paraglide/runtime.js";

type LevelThreshold = { min: number; max?: number };

const DEFAULT_THRESHOLDS: LevelThreshold[] = [
  { min: 0, max: 0 },
  { min: 1, max: 2 },
  { min: 3, max: 5 },
  { min: 6, max: 9 },
  { min: 10 },
];

function formatLevelLabel(threshold: LevelThreshold): string {
  if (threshold.min === 0 && threshold.max === 0) {
    return page_about_contribution_level_none();
  }

  if (threshold.max === undefined) {
    return page_about_contribution_level_more({ min: threshold.min });
  }

  return page_about_contribution_level_range({
    min: threshold.min,
    max: threshold.max,
  });
}

function formatTooltipContent(
  count: number,
  dateStr: string,
  locale: string
): string {
  const date = formatDateShort(dateStr, locale);
  return page_about_contribution_tooltip({ count, date });
}

const PLATFORM = "GitLab";

function formatSummary(count: number, platform = PLATFORM): string {
  return page_about_contribution_summary({ count, platform });
}

function fetchContributions(
  from: string,
  to: string
): Promise<ContributionData[]> {
  return fetch(`/api/contributions?from=${from}&to=${to}`).then((res) =>
    res.json()
  );
}

type ContributionGraphDates = ReturnType<typeof useContributionGraphDates>;

type ContributionSectionContentProps = ContributionGraphDates & {
  dataPromise: Promise<ContributionData[]>;
};

function ContributionSectionContent({
  dataPromise,
  weeks,
  months,
  weekdays,
  startDate,
  endDate,
}: ContributionSectionContentProps) {
  const locale = getLocale();
  const data = use(dataPromise);
  const visibleWeekdays = [1, 3, 5];

  const dataMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of data) {
      map.set(item.date, item.count);
    }
    return map;
  }, [data]);

  const totalContributions = useMemo(
    () => data.reduce((sum, item) => sum + item.count, 0),
    [data]
  );

  return (
    <section className="mx-auto w-full p-4">
      <ContributionGraph.Root
        data={data}
        endDate={endDate}
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
                  {visibleWeekdays.includes(day) && (
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
                  const count = dataMap.get(date) ?? 0;
                  return (
                    <Tooltip key={date}>
                      <TooltipTrigger asChild>
                        <ContributionGraph.Cell date={date} />
                      </TooltipTrigger>
                      <TooltipContent>
                        {formatTooltipContent(count, date, locale)}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </ContributionGraph.Row>
            ))}
          </ContributionGraph.Body>
        </ContributionGraph.Grid>
        <ContributionGraph.Legend className="justify-between">
          <div className="text-left text-sm">
            {formatSummary(totalContributions)}
          </div>
          <div className="flex items-center space-x-0.5">
            {DEFAULT_THRESHOLDS.map((threshold, idx) => (
              <Tooltip key={threshold.min}>
                <TooltipTrigger asChild>
                  <ContributionGraph.LegendItem
                    level={idx as 0 | 1 | 2 | 3 | 4}
                  />
                </TooltipTrigger>
                <TooltipContent>{formatLevelLabel(threshold)}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </ContributionGraph.Legend>
      </ContributionGraph.Root>
    </section>
  );
}

export default function ContributionSection() {
  const graphDates = useContributionGraphDates({ weekStartDay: 0 });
  const { startDate, endDate } = graphDates;

  return (
    <Suspense fallback={<ContributionSectionSkeleton />}>
      <ContributionSectionContent
        dataPromise={fetchContributions(
          toISODateString(startDate),
          toISODateString(endDate)
        )}
        {...graphDates}
      />
    </Suspense>
  );
}
