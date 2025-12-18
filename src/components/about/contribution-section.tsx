import { Suspense, use, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";

import ContributionCell from "@/components/about/contribution-cell";
import ContributionErrorFallback from "@/components/about/contribution-error-fallback";
import { ContributionSectionSkeleton } from "@/components/about/contribution-section-skeleton";
// biome-ignore lint/performance/noNamespaceImport: component pattern
import * as ContributionGraph from "@/components/common/contribution-graph";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CONTRIBUTIONS_CONFIG } from "@/config/contributions";
import { useContributionGraph } from "@/hooks/use-contributions-graph.ts";
import type { ContributionData } from "@/lib/contributions/types";
import { formatMonth, formatWeekday } from "@/lib/date";
import {
  page_about_contribution_level_more,
  page_about_contribution_level_none,
  page_about_contribution_level_range,
  page_about_contribution_summary,
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

function formatSummary(count: number): string {
  return page_about_contribution_summary({
    count,
    platform: CONTRIBUTIONS_CONFIG.source,
  });
}

function fetchContributions(
  from: string,
  to: string
): Promise<ContributionData[]> {
  return fetch(`/api/contributions?from=${from}&to=${to}`).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch contributions: ${res.status}`);
    }
    return res.json();
  });
}

function getLevelForCount(count: number): number {
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
}

type ContributionGraphDates = ReturnType<typeof useContributionGraph>;

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

  const totalContributions = useMemo(
    () => data.reduce((sum, item) => sum + item.count, 0),
    [data]
  );

  return (
    <section className="mx-auto w-full p-4">
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
                  return (
                    <ContributionCell date={date} key={date} locale={locale} />
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
  const graphDates = useContributionGraph({ weekStartDay: 0 });
  const { startDate, endDate } = graphDates;

  return (
    <ErrorBoundary FallbackComponent={ContributionErrorFallback}>
      <Suspense fallback={<ContributionSectionSkeleton />}>
        <ContributionSectionContent
          dataPromise={fetchContributions(startDate, endDate)}
          {...graphDates}
        />
      </Suspense>
    </ErrorBoundary>
  );
}
