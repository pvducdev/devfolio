import { useMemo } from "react";
import type { ContributionData } from "@/components/common/contribution-graph";
// biome-ignore lint/performance/noNamespaceImport: component pattern
import * as ContributionGraph from "@/components/common/contribution-graph";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useContributionGraphDates } from "@/hooks/use-contributions";
import { toISODateString } from "@/lib/utils";

function formatTooltipDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTooltipContent(count: number, dateStr: string): string {
  const formattedDate = formatTooltipDate(dateStr);
  if (count === 0) {
    return `No contributions on ${formattedDate}`;
  }
  const label = count === 1 ? "contribution" : "contributions";
  return `${count} ${label} on ${formattedDate}`;
}

function getRandomCount(rand: number): number {
  if (rand < 0.4) {
    return Math.floor(Math.random() * 3) + 1;
  }
  if (rand < 0.7) {
    return Math.floor(Math.random() * 5) + 3;
  }
  if (rand < 0.9) {
    return Math.floor(Math.random() * 8) + 5;
  }
  return Math.floor(Math.random() * 15) + 10;
}

function generateMockContributions(
  startDate: Date,
  endDate: Date
): ContributionData[] {
  const contributions: ContributionData[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseChance = isWeekend ? 0.3 : 0.7;

    if (Math.random() < baseChance) {
      contributions.push({
        date: new Date(current),
        count: getRandomCount(Math.random()),
      });
    }

    current.setDate(current.getDate() + 1);
  }

  return contributions;
}

export default function ContributionSection() {
  const { weeks, monthLabels, weekdayLabels, startDate, endDate } =
    useContributionGraphDates({
      weekStartDay: 0,
      monthLabelFormat: "short",
    });

  const mockData = useMemo(
    () => generateMockContributions(startDate, endDate),
    [startDate, endDate]
  );

  const totalContributions = useMemo(
    () => mockData.reduce((sum, d) => sum + d.count, 0),
    [mockData]
  );

  const dataMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of mockData) {
      map.set(toISODateString(item.date), item.count);
    }
    return map;
  }, [mockData]);

  const visibleWeekdays = [1, 3, 5];

  return (
    <section className="mx-auto max-w-4xl space-y-3 pt-4">
      <ContributionGraph.Root
        data={mockData}
        endDate={endDate}
        startDate={startDate}
      >
        <ContributionGraph.Grid>
          <ContributionGraph.Head>
            <ContributionGraph.Row>
              <ContributionGraph.HeaderCell className="pr-2" />
              {monthLabels.map((month) => (
                <ContributionGraph.HeaderCell
                  colSpan={month.colSpan}
                  key={`${month.year}-${month.month}`}
                >
                  <ContributionGraph.Label>
                    {month.label}
                  </ContributionGraph.Label>
                </ContributionGraph.HeaderCell>
              ))}
            </ContributionGraph.Row>
          </ContributionGraph.Head>
          <ContributionGraph.Body>
            {weekdayLabels.map((weekday, rowIndex) => (
              <ContributionGraph.Row key={weekday.day}>
                <ContributionGraph.HeaderCell className="pr-2 text-right">
                  {visibleWeekdays.includes(weekday.day) && (
                    <ContributionGraph.Label>
                      {weekday.shortLabel}
                    </ContributionGraph.Label>
                  )}
                </ContributionGraph.HeaderCell>
                {weeks.map((week, weekIndex) => {
                  const date = week[rowIndex];
                  if (!date) {
                    return (
                      <ContributionGraph.Cell
                        date={date}
                        key={`empty-${weekIndex}-${weekday.day}`}
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
                        {formatTooltipContent(count, date)}
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
            <span className="font-semibold">{totalContributions}</span>
            <span className="text-muted-foreground">
              {" "}
              contributions in the last year on GitLab
            </span>
          </div>
          <div className="flex items-center space-x-0.5">
            {(
              [
                [0, "No contributions"],
                [1, "1-2 contributions"],
                [2, "3-5 contributions"],
                [3, "6-9 contributions"],
                [4, "10+ contributions"],
              ] as const
            ).map(([level, label]) => (
              <Tooltip key={level}>
                <TooltipTrigger asChild>
                  <ContributionGraph.LegendItem level={level} />
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </ContributionGraph.Legend>
      </ContributionGraph.Root>
    </section>
  );
}
