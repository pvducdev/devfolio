import { Slot } from "@radix-ui/react-slot";
import {
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";

import { useControllableState } from "@/hooks/use-controllable-state";
import createCtx from "@/lib/create-ctx";
import { isWeekend as defaultIsWeekend, toISODateString } from "@/lib/utils";

const defaultIsToday = (date: string): boolean =>
  date === toISODateString(new Date());

type ContributionData = {
  date: Date | string;
  count: number;
  level?: number;
};

type ContributionGraphContextValue = {
  data: Map<string, ContributionData>;
  startDate: Date;
  endDate: Date;
  levels: number;
  maxCount: number;
  getLevelForCount: (count: number) => number;
  getDataForDate: (date: string) => ContributionData | undefined;
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  hoveredDate: string | null;
  onHoverDate: (date: string | null) => void;
  isWeekend: (date: string) => boolean;
  isToday: (date: string) => boolean;
};

const [useContributionGraph, ContributionGraphProvider] =
  createCtx<ContributionGraphContextValue>(
    "useContributionGraph must be used within a ContributionGraph"
  );

function getDefaultLevelThresholds(
  levels: number
): (count: number, max: number) => number {
  return (count: number, max: number) => {
    if (count === 0 || max === 0) {
      return 0;
    }
    const ratio = count / max;
    const level = Math.ceil(ratio * (levels - 1));
    return Math.min(level, levels - 1);
  };
}

type ContributionGraphProps = ComponentProps<"div"> & {
  data: ContributionData[];
  startDate?: Date;
  endDate?: Date;
  levels?: number;
  levelThresholds?: (count: number, max: number) => number;
  selectedDate?: string | null;
  defaultSelectedDate?: string | null;
  onSelectedDateChange?: (date: string | null) => void;
  onHoverDateChange?: (date: string | null) => void;
  isWeekend?: (date: string) => boolean;
  isToday?: (date: string) => boolean;
  children: ReactNode;
};

function ContributionGraphPrimitive({
  data,
  startDate: startDateProp,
  endDate: endDateProp,
  levels = 5,
  levelThresholds,
  selectedDate: selectedDateProp,
  defaultSelectedDate,
  onSelectedDateChange,
  onHoverDateChange,
  isWeekend = defaultIsWeekend,
  isToday = defaultIsToday,
  children,
  ...props
}: ContributionGraphProps) {
  const endDate = useMemo(() => endDateProp || new Date(), [endDateProp]);

  const startDate = useMemo(() => {
    if (startDateProp) {
      return startDateProp;
    }

    const date = new Date(endDate);
    date.setFullYear(date.getFullYear() - 1);

    return date;
  }, [startDateProp, endDate]);

  const [selectedDate, setSelectedDate] = useControllableState({
    prop: selectedDateProp,
    defaultProp: defaultSelectedDate ?? null,
    onChange: onSelectedDateChange,
    caller: "ContributionGraph",
  });

  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const handleHoverDate = (date: string | null) => {
    setHoveredDate(date);
    onHoverDateChange?.(date);
  };

  const { dataMap, maxCount } = useMemo(() => {
    const map = new Map<string, ContributionData>();
    let max = 0;

    for (const item of data) {
      const key = toISODateString(item.date);
      map.set(key, item);
      if (item.count > max) {
        max = item.count;
      }
    }

    return { dataMap: map, maxCount: max };
  }, [data]);

  const getLevelForCount = (count: number): number => {
    const thresholdFn = levelThresholds ?? getDefaultLevelThresholds(levels);
    return thresholdFn(count, maxCount);
  };

  const getDataForDate = (date: string): ContributionData | undefined =>
    dataMap.get(date);

  const contextValue: ContributionGraphContextValue = {
    data: dataMap,
    startDate,
    endDate,
    levels,
    maxCount,
    getLevelForCount,
    getDataForDate,
    selectedDate: selectedDate ?? null,
    onSelectDate: setSelectedDate,
    hoveredDate,
    onHoverDate: handleHoverDate,
    isWeekend,
    isToday,
  };

  return (
    <ContributionGraphProvider value={contextValue}>
      <div data-slot="contribution-graph" {...props}>
        {children}
      </div>
    </ContributionGraphProvider>
  );
}

type ContributionGraphGridProps = ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical";
  asChild?: boolean;
};

function ContributionGraphGrid({
  orientation = "horizontal",
  asChild = false,
  ...props
}: ContributionGraphGridProps) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      aria-label="Contribution graph"
      data-orientation={orientation}
      data-slot="contribution-graph-grid"
      role="grid"
      {...props}
    />
  );
}

type CellState = {
  date: string;
  count: number;
  level: number;
  isSelected: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isEmpty: boolean;
};

type ContributionGraphCellProps = Omit<
  ComponentProps<"button">,
  "onClick" | "onMouseEnter" | "onMouseLeave"
> & {
  date: string;
  asChild?: boolean;
  onClick?: (state: CellState, event: MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (
    state: CellState,
    event: MouseEvent<HTMLButtonElement>
  ) => void;
  onMouseLeave?: (
    state: CellState,
    event: MouseEvent<HTMLButtonElement>
  ) => void;
};

function ContributionGraphCell({
  date,
  asChild = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ContributionGraphCellProps) {
  const ctx = useContributionGraph();
  const Comp = asChild ? Slot : "button";

  const cellData = ctx.getDataForDate(date);
  const count = cellData?.count ?? 0;
  const level = cellData?.level ?? ctx.getLevelForCount(count);
  const isSelected = ctx.selectedDate === date;
  const isTodayDay = ctx.isToday(date);
  const isEmpty = !cellData;
  const isWeekendDay = ctx.isWeekend(date);

  const cellState: CellState = {
    date,
    count,
    level,
    isSelected,
    isToday: isTodayDay,
    isWeekend: isWeekendDay,
    isEmpty,
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    ctx.onSelectDate(isSelected ? null : date);
    onClick?.(cellState, event);
  };

  const handleMouseEnter = (event: MouseEvent<HTMLButtonElement>) => {
    ctx.onHoverDate(date);
    onMouseEnter?.(cellState, event);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
    ctx.onHoverDate(null);
    onMouseLeave?.(cellState, event);
  };

  return (
    <Comp
      // biome-ignore lint/nursery/noLeakedRender: TS requires undefined
      aria-current={isTodayDay ? "date" : undefined}
      aria-selected={isSelected}
      data-count={count}
      data-date={date}
      data-empty={isEmpty || undefined}
      data-level={level}
      data-selected={isSelected || undefined}
      data-slot="contribution-graph-cell"
      data-today={isTodayDay || undefined}
      data-weekend={isWeekendDay || undefined}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="gridcell"
      {...props}
    />
  );
}

type ContributionGraphContentProps = ComponentProps<"div"> & {
  asChild?: boolean;
};

function ContributionGraphContent({
  asChild = false,
  ...props
}: ContributionGraphContentProps) {
  const Comp = asChild ? Slot : "div";

  return <Comp data-slot="contribution-graph-content" {...props} />;
}

type ContributionGraphLabelsProps = ComponentProps<"div"> & {
  type: "months" | "weekdays";
  asChild?: boolean;
};

function ContributionGraphLabels({
  type,
  asChild = false,
  ...props
}: ContributionGraphLabelsProps) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      aria-hidden="true"
      data-slot="contribution-graph-labels"
      data-type={type}
      {...props}
    />
  );
}

type ContributionGraphLabelProps = ComponentProps<"span"> & {
  value?: number;
  asChild?: boolean;
};

function ContributionGraphLabel({
  value,
  asChild = false,
  ...props
}: ContributionGraphLabelProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp data-slot="contribution-graph-label" data-value={value} {...props} />
  );
}

type ContributionGraphLegendProps = ComponentProps<"div"> & {
  asChild?: boolean;
};

function ContributionGraphLegend({
  asChild = false,
  ...props
}: ContributionGraphLegendProps) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      aria-label="Contribution levels legend"
      data-slot="contribution-graph-legend"
      {...props}
    />
  );
}

type ContributionGraphLegendItemProps = ComponentProps<"span"> & {
  level: number;
  asChild?: boolean;
};

function ContributionGraphLegendItem({
  level,
  asChild = false,
  ...props
}: ContributionGraphLegendItemProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      aria-label={`Level ${level}`}
      data-level={level}
      data-slot="contribution-graph-legend-item"
      {...props}
    />
  );
}

export {
  ContributionGraphPrimitive,
  ContributionGraphCell,
  ContributionGraphContent,
  ContributionGraphGrid,
  ContributionGraphLabel,
  ContributionGraphLabels,
  ContributionGraphLegend,
  ContributionGraphLegendItem,
};

export type {
  CellState,
  ContributionData,
  ContributionGraphCellProps,
  ContributionGraphContentProps,
  ContributionGraphGridProps,
  ContributionGraphLabelProps,
  ContributionGraphLabelsProps,
  ContributionGraphLegendItemProps,
  ContributionGraphLegendProps,
  ContributionGraphProps,
};
