import { Slot } from "@radix-ui/react-slot";
import {
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";

import createCtx from "@/lib/create-ctx";
import { toISODateString } from "@/lib/utils";

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
};

const [useContributionGraph, ContributionGraphProvider] =
  createCtx<ContributionGraphContextValue>(
    "useContributionGraph must be used within a ContributionGraph"
  );

function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: {
  prop?: T;
  defaultProp?: T;
  onChange?: (value: T) => void;
}): [T | undefined, (value: T) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledValue;

  const setValue = (nextValue: T) => {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onChange?.(nextValue);
  };

  return [value, setValue];
}

function formatDateForLabel(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function isWeekend(dateStr: string): boolean {
  const date = new Date(dateStr);
  const day = date.getDay();
  return day === 0 || day === 6;
}

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
  children,
  ...props
}: ContributionGraphProps) {
  const endDate = useMemo(() => {
    if (endDateProp) {
      return endDateProp;
    }
    return new Date();
  }, [endDateProp]);

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

type ContributionGraphCellProps = ComponentProps<"button"> & {
  date: string;
  asChild?: boolean;
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
  const isToday = date === toISODateString(new Date());
  const isEmpty = !cellData;
  const isWeekendDay = isWeekend(date);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    ctx.onSelectDate(isSelected ? null : date);
    onClick?.(event);
  };

  const handleMouseEnter = (event: MouseEvent<HTMLButtonElement>) => {
    ctx.onHoverDate(date);
    onMouseEnter?.(event);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
    ctx.onHoverDate(null);
    onMouseLeave?.(event);
  };

  return (
    <Comp
      // biome-ignore lint/nursery/noLeakedRender: TS requires undefined
      aria-current={isToday ? "date" : undefined}
      aria-label={`${count} contributions on ${formatDateForLabel(date)}`}
      aria-selected={isSelected}
      data-count={count}
      data-date={date}
      data-empty={isEmpty || undefined}
      data-level={level}
      data-selected={isSelected || undefined}
      data-slot="contribution-graph-cell"
      data-today={isToday || undefined}
      data-weekend={isWeekendDay || undefined}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="gridcell"
      {...props}
    />
  );
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
  ContributionGraphGrid,
  ContributionGraphLabel,
  ContributionGraphLabels,
  ContributionGraphLegend,
  ContributionGraphLegendItem,
  useContributionGraph,
};

export type {
  ContributionData,
  ContributionGraphCellProps,
  ContributionGraphGridProps,
  ContributionGraphLabelProps,
  ContributionGraphLabelsProps,
  ContributionGraphLegendItemProps,
  ContributionGraphLegendProps,
  ContributionGraphProps,
};
